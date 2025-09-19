import { campusFetch } from '@/lib/client';
import { parseContentDispositionFilename } from '@/lib/utils';
import qs from 'query-string';

export type DeanCertificate = {
  id: number;
  publicKey: string;
  requestedBy: { userAccountId: number; fullName: string };
  purpose: string;
  reason: string;
  created: Date;
  processed?: Date;
  received?: Date;
  status: string;
  type: string;
  originalRequired: boolean;
  notes?: string;
};

export async function getFacultyCertificates() {
  const res = await campusFetch<DeanCertificate[]>('/dean/certificates/requests');
  const allCertificates = await res.json();

  const pendingCertificates = allCertificates.filter((item) => item.status === 'Pending');
  const approvedCertificates = allCertificates.filter((item) => item.status === 'Approved');
  const rejectedCertificates = allCertificates.filter((item) => item.status === 'Rejected');

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

export async function updateCertificate(id: number, status: string, reason?: string) {
  const response = await campusFetch(`/dean/certificates/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });

  return response.json();
}
