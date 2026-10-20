import dayjs from 'dayjs';
import type { useTranslations } from 'next-intl';
import { z } from 'zod';

export const getCuratorAssignmentDateBounds = () => {
  const year = Number(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Kiev', year: 'numeric' }).format(new Date()));
  return { minDate: `${year - 1}-01-01`, maxDate: `${year + 1}-12-31` };
};

export const createCuratorAssignmentSchema = (
  t: ReturnType<typeof useTranslations<'private.curatorlecturer.group-curator.administration'>>,
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
            const { minDate, maxDate } = getCuratorAssignmentDateBounds();
            return date >= minDate && date <= maxDate;
          },
          t('validation.date-range', getCuratorAssignmentDateBounds()),
        ),
      endDate: z
        .string()
        .min(1, t('validation.required'))
        .pipe(z.iso.date({ error: t('validation.invalid-date') }))
        .refine(
          (date) => {
            const { minDate, maxDate } = getCuratorAssignmentDateBounds();
            return date >= minDate && date <= maxDate;
          },
          t('validation.date-range', getCuratorAssignmentDateBounds()),
        ),
    })
    .refine(({ startDate, endDate }) => !dayjs(endDate).isBefore(dayjs(startDate), 'day'), {
      message: t('validation.invalid-period'),
      path: ['endDate'],
    });

export type CuratorAssignmentFormValues = z.infer<ReturnType<typeof createCuratorAssignmentSchema>>;
