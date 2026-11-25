'use server';

import { notFound } from 'next/navigation';
import qs from 'query-string';

import { campusFetch } from '@/lib/client';
import { type DnvrAttestationReport, type DnvrStudentCount } from '@/types/models/dnvr-reporting';

export async function getDnvrStudentCounts(filters: {
  period?: number;
  report?: DnvrAttestationReport;
  facultyId?: number;
  educationLevelId?: number;
  course?: number;
}) {
  const { report, period, ...detail } = filters;
  let url = '/dnvr-reporting/attestation/student-counts';
  if (report) {
    url = qs.stringifyUrl({ url: '/dnvr-reporting/attestation/reports/' + report, query: { period, ...detail } });
  } else if (period !== undefined) {
    url = qs.stringifyUrl({ url: '/dnvr-reporting/attestation/participation', query: { period } });
  }

  const response = await campusFetch<DnvrStudentCount[]>(url);

  if (response.status === 403 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`DNVR reporting request failed: ${response.status}`);
  }

  return response.json();
}
