import type { CuratorAttestationTotals } from './types';

export const GROUP_FILTERS = ['course', 'educationLevel', 'studyForm'] as const;

export const GROUP_FILTER_LABELS: Record<(typeof GROUP_FILTERS)[number], Readonly<Record<string, string>>> = {
  course: {},
  educationLevel: {
    Bachelor: 'Бакалавр',
    MasterProfessional: 'Магістр ОПП',
    MasterScientific: 'Магістр ОНП',
    PhD: 'Доктор філософії',
    Other: 'Інше',
  },
  studyForm: {
    None: 'Не вказано',
    Evening: 'Вечірня',
    FullTime: 'Денна',
    Remote: 'Дистанційна',
    Extern: 'Екстернат',
    Correspondence: 'Заочна',
    Shortened: 'Скорочена',
    OutOfPostgraduate: 'Поза аспірантурою',
    Other: 'Інше',
  },
};

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
