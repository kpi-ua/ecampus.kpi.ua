'use server';

import { campusFetch } from '@/lib/client';
import { Certificate } from '@/types/models/certificate/certificate';
import { revalidatePath } from 'next/cache';
import { CertificateVerificationResult } from '@/types/models/certificate/certificate-verification-result';
import { parseContentDispositionFilename } from '@/lib/utils';
import { CertificateStatus } from '@/types/models/certificate/status';
import { CertificateSignatory } from '@/types/models/certificate/signatory';
import { StudentCertificateData } from '@/types/models/certificate/student-certificate-data';
import { CertificateOperatorCreateRequest, StudentSearchResult } from '@/types/models/certificate/operator-request';
import qs from 'query-string';

export async function getCertificateTypes() {
  const response = await campusFetch<string[]>('/certificates/types');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
export type UpdateCertificateBody = {
  approve: boolean;
  reason?: string;
  notes?: string;
  signatoryId?: number;
};

export async function updateCertificate(id: number, body: UpdateCertificateBody) {
  const res = await campusFetch(`/certificates/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ ...body }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  revalidatePath('/module/facultycertificate', 'layout');
}

export async function regenerateCertificate(id: number) {
  const res = await campusFetch(`/certificates/${id}/regenerate`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  revalidatePath('/module/facultycertificate', 'layout');
}

type CertificateRequestBody = {
  type: string;
  originalRequired?: boolean;
  notes?: string;
  purpose?: string;
  includeOrderInfo?: boolean;
};

export async function createCertificateRequest(body: CertificateRequestBody) {
  await campusFetch('/certificates', {
    method: 'POST',
    body: JSON.stringify({ ...body }),
  });

  revalidatePath('/module/certificates');
}

export async function getCertificateList() {
  const response = await campusFetch<Certificate[]>('/certificates');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export async function getAllFacultyCertificates(query: FacultyCertificatesQuery = {}) {
  const queryParams = qs.stringify(query);
  const res = await campusFetch<Certificate[]>(`/certificates/all?${queryParams}`);
  const allCertificates = await res.json();

  const totalCount = parseInt(res.headers.get('x-total-count') || '0', 10);
  return { allCertificates, totalCount };
}

export async function getCertificatePDF(id: number) {
  try {
    const response = await campusFetch(`/certificates/${id}/pdf`, {
      headers: {
        Accept: 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
    }

    const cd = response.headers.get('Content-Disposition') || '';
    const filename = parseContentDispositionFilename(cd) ?? `certificate.pdf`;
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      filename,
      base64,
    };
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

export async function getCertificate(id: number) {
  const res = await campusFetch<Certificate>(`/certificates/${id}`);
  return res.json();
}

export async function verifyCertificate(id: string) {
  const response = await campusFetch<CertificateVerificationResult>(`/certificates/validate/${id}`);
  if (!response.ok) {
    return 'error';
  }

  return response.json();
}

export interface FacultyCertificatesQuery {
  page?: string;
  size?: string;
  filter?: string;
  status?: string;
}

export async function getOtherFacultyCertificate() {
  const res = await campusFetch<Certificate[]>('/certificates/all');

  if (!res.ok) {
    throw new Error(`${res.status} Error`);
  }

  const data = await res.json();
  const rejectedCertificates = data.filter((item) => item.approved === false);
  const approvedCertificates = data.filter(
    (item) => item.approved === true && item.status === CertificateStatus.Processed,
  );
  const createdCertificates = data.filter(
    (item) => item.approved === null && item.status === CertificateStatus.Created,
  );

  return { rejectedCertificates, approvedCertificates, createdCertificates };
}

export async function signCertificate(id: number) {
  const response = await campusFetch(`/certificates/${id}/signed`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  revalidatePath('/module/facultycertificate', 'layout');
}

export async function getSignatories() {
  const response = await campusFetch<CertificateSignatory[]>('/certificates/signatories');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getCertificateData(id: number) {
  const response = await campusFetch<StudentCertificateData>(`/certificates/${id}/data`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
}

export async function getUnsignedCertificatePDF(id: number) {
  const response = await campusFetch(`/certificates/${id}/pdf/unsigned`, {
    headers: { Accept: 'application/pdf' },
  });

  if (!response.ok) {
    throw new Error(`Failed to download unsigned PDF: ${response.status} ${response.statusText}`);
  }

  const cd = response.headers.get('Content-Disposition') || '';
  const filename = parseContentDispositionFilename(cd) ?? `certificate-unsigned.pdf`;
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  return { filename, base64 };
}

export async function createCertificateAsOperator(body: CertificateOperatorCreateRequest) {
  const res = await campusFetch('/certificates/operator', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  revalidatePath('/module/facultycertificate', 'layout');
  return res.json();
}

export interface OperatorStudentsQuery {
  page?: number;
  size?: number;
  filter?: string;
}

export async function searchStudentsForOperator(query: OperatorStudentsQuery = {}) {
  const queryParams = qs.stringify(query);
  const response = await campusFetch<StudentSearchResult[]>(`/certificates/operator/students?${queryParams}`);

  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  const items = await response.json();
  const totalCount = parseInt(response.headers.get('x-total-count') || '0', 10);

  return { items, totalCount };
}
