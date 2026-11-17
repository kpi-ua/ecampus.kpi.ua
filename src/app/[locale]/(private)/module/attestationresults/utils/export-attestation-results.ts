import { saveAsBlob } from '@/lib/save-as-blob';

import { serializeAttestationReportSearchParams } from '../search-params';
import { AttestationReportQuery } from '../types';

export const exportAttestationResults = async (query: AttestationReportQuery) => {
  const response = await fetch(serializeAttestationReportSearchParams('/api/attestationresults/export', query));
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  await saveAsBlob(response, 'attestation-results.csv');
};
