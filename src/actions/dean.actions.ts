'use server';

import { campusFetch } from '@/lib/client';
import { parseContentDispositionFilename } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { CertificateStatus } from '@/types/models/certificate/status';
import { Certificate } from '@/types/models/certificate/certificate';

export async function getFacultyCertificates() {
  const res = await campusFetch<Certificate[]>('/dean/certificates/requests');
  const allCertificates = await res.json();

  const createdCertificates = allCertificates.filter((item) => item.status === CertificateStatus.Created);
  const approvedCertificates = allCertificates.filter(
    (item) => item.approved === true && item.status === CertificateStatus.Processed,
  );
  const rejectedCertificates = allCertificates.filter((item) => item.approved === false);
  console.log(approvedCertificates);

  return { allCertificates, rejectedCertificates, createdCertificates, approvedCertificates };
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
