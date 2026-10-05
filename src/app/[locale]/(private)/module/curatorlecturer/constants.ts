export const ATTESTATION_RESULT = {
  Attested: 'a',
  NotAttested: 'na',
  NotStudying: 'nv',
  Missing: null,
} as const;

export const ATTESTATION_COLUMNS = [
  { result: ATTESTATION_RESULT.Attested, label: 'attested', code: 'attested-code', variant: 'success' },
  { result: ATTESTATION_RESULT.Missing, label: 'missing', code: 'missing-code', variant: 'yellow' },
  { result: ATTESTATION_RESULT.NotAttested, label: 'not-attested', code: 'not-attested-code', variant: 'error' },
  { result: ATTESTATION_RESULT.NotStudying, label: 'not-studying', code: 'not-studying-code', variant: 'neutral' },
] as const;
