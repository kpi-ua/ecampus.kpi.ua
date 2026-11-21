export type SbpPeriodState = 'Future' | 'Current' | 'Finished';

export type SbpPeriodPhase =
  | 'Planned'
  | 'Submission'
  | 'SubmissionAndReview'
  | 'Review'
  | 'Appeal'
  | 'Leftover'
  | 'Archive';

/** An sbpPeriod row; dates are Europe/Kyiv local time without an offset. */
export interface SbpPeriod {
  id: number;
  studyingYearId: number;
  studyingYearName: string;
  semester: number;
  studentDateStart: string;
  studentDateEnd: string;
  operatorDateStart: string;
  operatorDateEnd: string;
  dateExport: string | null;
  recordsCount: number;
  isExported: boolean;
  state: SbpPeriodState;
  phase: SbpPeriodPhase;
}

/** Dates as YYYY-MM-DD; the API stores the times. */
export interface SaveSbpPeriodPayload {
  studyingYearId: number;
  semester: number;
  studentDateStart: string;
  studentDateEnd: string;
  operatorDateStart: string;
  operatorDateEnd: string;
  dateExport: string;
}

export type SbpPeriodField = keyof Omit<SaveSbpPeriodPayload, 'studyingYearId'> | '';

/** A period rule the API refused the change by (R1–R10, E1–E5). */
export interface SbpPeriodRuleViolation {
  code: string;
  field: SbpPeriodField;
  conflict: { id: number; studyingYearName: string; semester: number } | null;
}

export type SbpPeriodActionResult = { ok: true } | { ok: false; violation: SbpPeriodRuleViolation };
