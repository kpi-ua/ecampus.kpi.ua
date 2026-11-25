import { dash } from 'radash';

import { DnvrAttestationReport } from '@/types/models/dnvr-reporting';

export const DNVR_PATH = '/module/hignyak';
export const attestationPeriods = ['1', '2', '3'] as const;
export const attestationReports = Object.values(DnvrAttestationReport);
export const currentControlViews = ['groups', 'lecturers', 'statistics', 'outward', 'summary'] as const;

export type AttestationPeriod = (typeof attestationPeriods)[number];
export type CurrentControlView = (typeof currentControlViews)[number];

export function getAttestationPath(report?: DnvrAttestationReport | null) {
  const path = `${DNVR_PATH}/attestation`;
  return report ? `${path}/${dash(report)}` : path;
}

export function getCurrentControlPath(view?: CurrentControlView) {
  const path = `${DNVR_PATH}/current-control`;
  return view ? `${path}/${view}` : path;
}
