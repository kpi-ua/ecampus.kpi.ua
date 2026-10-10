import type { CuratorAttestationTotals } from './types';

export const ATTESTATION_RESULT = {
  Attested: 'a',
  NotAttested: 'na',
  NotStudying: 'nv',
  Missing: null,
} as const;

export const ATTESTATION_COLUMNS = [
  { key: 'attested', label: 'attested', code: 'attested-code', variant: 'success' },
  { key: 'missing', label: 'missing', code: 'missing-code', variant: 'yellow' },
  { key: 'notAttested', label: 'not-attested', code: 'not-attested-code', variant: 'error' },
  { key: 'notStudying', label: 'not-studying', code: 'not-studying-code', variant: 'neutral' },
] as const satisfies readonly {
  key: keyof CuratorAttestationTotals;
  label: string;
  code: string;
  variant: string;
}[];
