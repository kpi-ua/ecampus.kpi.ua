'use server';

import { campusFetch } from '@/lib/client';
import { DeanCertificate } from '@/types/models/dean/dean-certificate';
import { DeanCertificateStatus } from '@/types/enums/dean/certificate-status';
import { parseContentDispositionFilename } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getFacultyCertificates() {
  const res = await campusFetch<DeanCertificate[]>('/dean/certificates/requests');
  const allCertificates = await res.json();

  const pendingCertificates = allCertificates.filter((item) => item.status === DeanCertificateStatus.Created);
  const approvedCertificates = allCertificates.filter((item) => item.status === 'Approved');
  const rejectedCertificates = allCertificates.filter((item) => item.status === 'Rejected');

  const proc = allCertificates.filter((item) => item.status === DeanCertificateStatus.Processed);
  // console.log(proc);

  return { allCertificates, rejectedCertificates, pendingCertificates, approvedCertificates };
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

  console.log(res);
  revalidatePath('/module/facultycertificate');

  if (!res.ok) {
    throw new Error(res.statusText);
  }
}
