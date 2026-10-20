import dayjs from 'dayjs';
import type { useTranslations } from 'next-intl';
import { z } from 'zod';

export const getCuratorAssignmentDateBounds = (year: number) => ({
  minDate: `${year - 1}-01-01`,
  maxDate: `${year + 1}-12-31`,
});

export const createCuratorAssignmentSchema = (
  t: ReturnType<typeof useTranslations<'private.curatorlecturer.group-curator.administration'>>,
  year: number,
) =>
  z
    .object({
      employeeId: z.string().min(1, t('validation.lecturer-required')),
      startDate: z
        .string()
        .min(1, t('validation.required'))
        .pipe(z.iso.date({ error: t('validation.invalid-date') }))
        .refine(
          (date) => {
            const { minDate, maxDate } = getCuratorAssignmentDateBounds(year);
            return date >= minDate && date <= maxDate;
          },
          t('validation.date-range', getCuratorAssignmentDateBounds(year)),
        ),
      endDate: z
        .string()
        .min(1, t('validation.required'))
        .pipe(z.iso.date({ error: t('validation.invalid-date') }))
        .refine(
          (date) => {
            const { minDate, maxDate } = getCuratorAssignmentDateBounds(year);
            return date >= minDate && date <= maxDate;
          },
          t('validation.date-range', getCuratorAssignmentDateBounds(year)),
        ),
    })
    .refine(({ startDate, endDate }) => !dayjs(endDate).isBefore(dayjs(startDate), 'day'), {
      message: t('validation.invalid-period'),
      path: ['endDate'],
    });

export type CuratorAssignmentFormValues = z.infer<ReturnType<typeof createCuratorAssignmentSchema>>;
