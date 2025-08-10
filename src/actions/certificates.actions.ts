'use server';

import { campusFetch } from '@/lib/client';
import { Certificate } from '@/types/models/certificate/certificate';
import { revalidatePath } from 'next/cache';
import { CertificateVerificationResult } from '@/types/models/certificate/certificate-verification-result';

export async function getCertificateTypes() {
  const response = await campusFetch<string[]>('/certificates/types');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}

export async function createCertificateRequest(type: string, purpose?: string) {
  await campusFetch('certificates/requests', {
    method: 'POST',
    body: JSON.stringify({ type, purpose }),
  });

  revalidatePath('/module/studdoc');
}

export async function getCertificateList() {
  const response = await campusFetch<Certificate[]>('/certificates/requests');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
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

    return await response.blob();
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

export async function verifyCertificate(id: string) {
  const response = await campusFetch<CertificateVerificationResult>(`/certificates/validate/${id}`);
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
