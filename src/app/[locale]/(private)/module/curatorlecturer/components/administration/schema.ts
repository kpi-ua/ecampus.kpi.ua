import dayjs from 'dayjs';
import type { useTranslations } from 'next-intl';
import { z } from 'zod';

export const getCuratorAssignmentDateBounds = (startDate: string, endDate: string) => ({
  minDate: startDate.slice(0, 10),
  maxDate: endDate.slice(0, 10),
});

export const createCuratorAssignmentSchema = (
  t: ReturnType<typeof useTranslations<'private.curatorlecturer.group-curator.administration'>>,
  academicYearStart: string,
  academicYearEnd: string,
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
            const { minDate, maxDate } = getCuratorAssignmentDateBounds(academicYearStart, academicYearEnd);
            return date >= minDate && date <= maxDate;
          },
          t('validation.date-range', getCuratorAssignmentDateBounds(academicYearStart, academicYearEnd)),
        ),
      endDate: z
        .string()
        .min(1, t('validation.required'))
        .pipe(z.iso.date({ error: t('validation.invalid-date') }))
        .refine(
          (date) => {
            const { minDate, maxDate } = getCuratorAssignmentDateBounds(academicYearStart, academicYearEnd);
            return date >= minDate && date <= maxDate;
          },
          t('validation.date-range', getCuratorAssignmentDateBounds(academicYearStart, academicYearEnd)),
        ),
    })
    .refine(({ startDate, endDate }) => !dayjs(endDate).isBefore(dayjs(startDate), 'day'), {
      message: t('validation.invalid-period'),
      path: ['endDate'],
    });

export type CuratorAssignmentFormValues = z.infer<ReturnType<typeof createCuratorAssignmentSchema>>;
