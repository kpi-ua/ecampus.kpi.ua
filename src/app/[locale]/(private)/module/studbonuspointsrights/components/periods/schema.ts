import { z } from 'zod';

import { EntityIdName } from '@/types/models/entity-id-name';
import { SbpPeriod } from '@/types/models/sbp-periods';

type Translate = (key: string, values?: Record<string, string | number>) => string;

/** YYYY-MM-DD of an API date, which comes without an offset. */
export const toDay = (date: string | null | undefined) => (date ? date.slice(0, 10) : '');

export const periodYear = (studyingYearName: string) => studyingYearName.replace('-', '/');

export const periodLabel = (t: Translate, period: Pick<SbpPeriod, 'studyingYearName' | 'semester'>) =>
  t('periodLabel', { year: periodYear(period.studyingYearName), semester: period.semester });

/** Today as the API sees it: the period rules are checked in Europe/Kyiv, whatever the browser's zone is. */
const kyivToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(new Date());

/** Study year names are «2026-2027», so ordinal order is chronological. */
const compareOrder = (a: { year: string; semester: number }, b: { year: string; semester: number }) =>
  a.year === b.year ? a.semester - b.semester : a.year < b.year ? -1 : 1;

/**
 * Rules R1–R10 of the module spec; the API checks them again and is the source of truth.
 * Dates are compared as YYYY-MM-DD strings.
 */
export const createPeriodFormSchema = (
  t: Translate,
  periods: SbpPeriod[],
  studyYears: EntityIdName[],
  periodId?: number,
) => {
  const date = z.iso.date(t('errors.R10'));

  return z
    .object({
      studyingYearId: z.string().min(1, t('errors.year')),
      semester: z.number().int().min(1).max(2),
      studentDateStart: date,
      studentDateEnd: date,
      operatorDateStart: date,
      operatorDateEnd: date,
      dateExport: date,
    })
    .superRefine((v, ctx) => {
      const issue = (path: keyof typeof v, code: string, values?: Record<string, string | number>) =>
        ctx.addIssue({ code: 'custom', path: [path], message: t(`errors.${code}`, values) });

      if (v.studentDateEnd < v.studentDateStart) {
        issue('studentDateEnd', 'R1');
      }
      if (v.operatorDateEnd < v.operatorDateStart) {
        issue('operatorDateEnd', 'R2');
      }
      if (v.operatorDateStart < v.studentDateStart) {
        issue('operatorDateStart', 'R3');
      }
      if (v.operatorDateEnd < v.studentDateEnd) {
        issue('operatorDateEnd', 'R4');
      }
      if (v.dateExport <= v.operatorDateEnd) {
        issue('dateExport', 'R5');
      } else if (v.dateExport < kyivToday()) {
        issue('dateExport', 'R6');
      }

      const others = periods.filter((p) => p.id !== periodId);
      const yearId = Number(v.studyingYearId);
      const year = studyYears.find((y) => y.id === yearId)?.name ?? '';

      const duplicate = others.find((p) => p.studyingYearId === yearId && p.semester === v.semester);
      if (duplicate) {
        issue('semester', 'R7');
        return;
      }

      const overlap = others.find(
        (p) =>
          v.studentDateStart <= toDay(p.dateExport ?? p.operatorDateEnd) && toDay(p.studentDateStart) <= v.dateExport,
      );
      if (overlap) {
        issue('studentDateStart', 'R8', { period: periodLabel(t, overlap) });
        return;
      }

      const outOfOrder = others.find((p) => {
        const order = compareOrder({ year: p.studyingYearName, semester: p.semester }, { year, semester: v.semester });
        const start = toDay(p.studentDateStart);
        return (order < 0 && start >= v.studentDateStart) || (order > 0 && start <= v.studentDateStart);
      });
      if (outOfOrder) {
        issue('studentDateStart', 'R9', { period: periodLabel(t, outOfOrder) });
      }
    });
};

export type PeriodFormValues = z.infer<ReturnType<typeof createPeriodFormSchema>>;
