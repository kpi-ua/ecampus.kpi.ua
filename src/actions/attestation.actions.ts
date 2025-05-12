import { campusFetch } from '@/lib/client';
import { AttestationResult } from '@/types/models/attestation-results/attestation-result';

export async function getAttestationResults() {
  const response = await campusFetch<AttestationResult[]>('/attestation');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }

  return response.json();
}
