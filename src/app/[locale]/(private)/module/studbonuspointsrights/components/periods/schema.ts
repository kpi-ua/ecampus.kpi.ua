import { z } from 'zod';

/**
 * The date rules R1–R5 and R10 of the module spec, which need nothing but the form's own values.
 * The API checks every rule and answers with the field a broken one belongs to; the rules that depend
 * on today or on other periods (R6–R9) are left to it. Dates are compared as YYYY-MM-DD strings.
 */
export const createPeriodFormSchema = (t: (key: string) => string) => {
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
    .refine((v) => v.studentDateEnd >= v.studentDateStart, { path: ['studentDateEnd'], message: t('errors.R1') })
    .refine((v) => v.operatorDateEnd >= v.operatorDateStart, { path: ['operatorDateEnd'], message: t('errors.R2') })
    .refine((v) => v.operatorDateStart >= v.studentDateStart, { path: ['operatorDateStart'], message: t('errors.R3') })
    .refine((v) => v.operatorDateEnd >= v.studentDateEnd, { path: ['operatorDateEnd'], message: t('errors.R4') })
    .refine((v) => v.dateExport > v.operatorDateEnd, { path: ['dateExport'], message: t('errors.R5') });
};

export type PeriodFormValues = z.infer<ReturnType<typeof createPeriodFormSchema>>;
