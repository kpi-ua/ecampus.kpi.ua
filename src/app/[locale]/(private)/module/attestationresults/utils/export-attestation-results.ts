import queryString from 'query-string';

import { saveAsBlob } from '@/lib/save-as-blob';

import { AttestationReportQuery } from '../types';

export const exportAttestationResults = async (params: AttestationReportQuery) => {
  const url = queryString.stringifyUrl(
    { url: '/api/attestationresults/export', query: { ...params } },
    { skipEmptyString: true, skipNull: true },
  );
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to export attestations: ${response.status}`);
  }
  await saveAsBlob(response, 'attestation-results.csv');
};
