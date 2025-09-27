'use server';

import { campusFetch } from '@/lib/client';
import { parseContentDispositionFilename } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { CertificateStatus } from '@/types/models/certificate/status';
import { Certificate } from '@/types/models/certificate/certificate';

export interface FacultyCertificatesQuery {
  page?: string;
  size?: string;
  filter?: string;
  status?: string;
}

export async function getAllFacultyCertificates(query: FacultyCertificatesQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page);
  if (query.size) params.append('size', query.size);
  if (query.filter) params.append('filter', query.filter);

  const url = `/dean/certificates/requests${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await campusFetch<Certificate[]>(url);
  const allCertificates = await res.json();

  const totalCount = parseInt(res.headers.get('x-total-count') || '0');
  return { allCertificates, totalCount };
}

export async function getOtherFacultyCertificate() {
  const res = await campusFetch<Certificate[]>('/dean/certificates/requests');
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

export async function getCertificate(id: number) {
  const res = await campusFetch<Certificate>(`/dean/certificates/${id}`);
  return res.json();
}

export async function getDeanCertificatePDF(id: number, withoutStamp = false) {
  try {
    const response = await campusFetch(`dean/certificates/${id}/pdf?withoutStamp=${withoutStamp}`, {
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

export type UpdateCertificateBody = {
  approve: boolean;
  reason?: string;
};

export async function updateCertificate(id: number, body: UpdateCertificateBody) {
  const res = await campusFetch(`/dean/certificates/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ ...body }),
  });

  revalidatePath('/module/facultycertificate', 'layout');

  if (!res.ok) {
    throw new Error(res.statusText);
  }
}
