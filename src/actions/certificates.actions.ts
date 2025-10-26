'use server';

import { campusFetch } from '@/lib/client';
import { Certificate } from '@/types/models/certificate/certificate';
import { revalidatePath } from 'next/cache';
import { CertificateVerificationResult } from '@/types/models/certificate/certificate-verification-result';
import { parseContentDispositionFilename } from '@/lib/utils';
import { CertificateStatus } from '@/types/models/certificate/status';
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
type CertificateRequestBody = {
  type: string;
  originalRequired?: boolean;
  notes?: string;
  purpose?: string;
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
    const blob = await response.blob();

    return {
      filename,
      blob,
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