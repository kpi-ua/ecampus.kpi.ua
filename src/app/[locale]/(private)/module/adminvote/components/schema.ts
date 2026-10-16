import { z } from 'zod';

import { formatDate } from '@/lib/utils';
import { VoteAdminTerm } from '@/types/models/vote/administration';

export const MAX_COEFFICIENT = 1;

export const createCriterionFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t('validation.name')).max(255, t('validation.name-length')),
    coefficient: z
      .string()
      .trim()
      .min(1, t('validation.coefficient'))
      .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, t('validation.coefficient'))
      .refine((value) => {
        const coefficient = Number(value);
        if (!Number.isFinite(coefficient) || coefficient <= 0) {
          return true;
        }
        return coefficient <= MAX_COEFFICIENT;
      }, t('validation.coefficients-total')),
  });

export type CriterionFormValues = z.infer<ReturnType<typeof createCriterionFormSchema>>;

export const createPeriodFormSchema = (t: (key: string) => string, periods: VoteAdminTerm[], periodId?: number) => {
  const validDate = z.iso.date(t('validation.date'));
  return z
    .object({
      number: z
        .string()
        .refine((value) => Number.isSafeInteger(Number(value)) && Number(value) > 0, t('validation.number')),
      studyYear: z.string().length(9, t('validation.year')),
      startsOn: validDate,
      semester: z.number().nonnegative().min(1),
      endsOn: validDate,
      resultsPublishOn: validDate,
    })
    .refine((values) => values.endsOn >= values.startsOn, {
      path: ['endsOn'],
      message: t('validation.end'),
    })
    .refine((values) => values.resultsPublishOn > values.endsOn, {
      path: ['resultsPublishOn'],
      message: t('validation.results'),
    })
    .refine(
      (values) =>
        !periods.some(
          (other) =>
            other.id !== periodId &&
            other.isActive &&
            values.startsOn <= formatDate(other.endsOn) &&
            values.endsOn >= formatDate(other.startsOn),
        ),
      {
        path: ['startsOn'],
        message: t('validation.overlap'),
      },
    );
};

export type PeriodFormValues = z.infer<ReturnType<typeof createPeriodFormSchema>>;
