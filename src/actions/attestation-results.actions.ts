'use server';

import qs from 'query-string';

import {
  AttestationReport,
  AttestationReportGroup,
  AttestationReportOptions,
  AttestationReportQuery,
  AttestationReportStudent,
} from '@/app/[locale]/(private)/module/attestationresults/types';
import { campusFetch } from '@/lib/client';

export const getAttestationReportOptions = async (): Promise<AttestationReportOptions> => {
  const response = await campusFetch<AttestationReportOptions>('/attestation-results/options');
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getAttestationReportGroups = async (query: AttestationReportQuery): Promise<AttestationReportGroup[]> => {
  const response = await campusFetch<AttestationReportGroup[]>(
    qs.stringifyUrl({ url: '/attestation-results/groups', query: { ...query } }),
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getAttestationReportStudents = async (
  query: AttestationReportQuery,
): Promise<AttestationReportStudent[]> => {
  const response = await campusFetch<AttestationReportStudent[]>(
    qs.stringifyUrl({ url: '/attestation-results/students', query: { ...query } }),
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};

export const getAttestationReport = async (query: AttestationReportQuery): Promise<AttestationReport> => {
  const response = await campusFetch<AttestationReport>(
    qs.stringifyUrl({ url: '/attestation-results/report', query: { ...query } }),
  );
  if (!response.ok) {
    throw new Error(`${response.status} Error`);
  }
  return response.json();
};
