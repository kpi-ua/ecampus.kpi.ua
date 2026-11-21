import dayjs from 'dayjs';

import { SbpPeriod } from '@/types/models/sbp-periods';

type Translate = (key: string, values?: Record<string, string | number>) => string;

/** YYYY-MM-DD of an API date, which comes without an offset. */
export const toDay = (date: string | null | undefined) => (date ? date.slice(0, 10) : '');

export const periodYear = (studyingYearName: string) => studyingYearName.replace('-', '/');

export const periodLabel = (t: Translate, period: Pick<SbpPeriod, 'studyingYearName' | 'semester'>) =>
  t('periodLabel', { year: periodYear(period.studyingYearName), semester: period.semester });

/** Appeal runs from the day after OperatorDateEnd to the day before DateExport; none when they are adjacent. */
export const appealRange = (operatorDateEnd: string, dateExport: string | null) => {
  if (!dateExport) {
    return null;
  }
  const from = dayjs(toDay(operatorDateEnd)).add(1, 'day');
  const to = dayjs(toDay(dateExport)).subtract(1, 'day');
  return from.isAfter(to, 'day') ? null : { from, to };
};

export const canEditPeriod = (period: SbpPeriod) => period.state !== 'Finished';

export const canDeletePeriod = (period: SbpPeriod) => period.state === 'Future' && period.recordsCount === 0;
