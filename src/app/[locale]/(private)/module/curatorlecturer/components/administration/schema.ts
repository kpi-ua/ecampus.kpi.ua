import type { useTranslations } from 'next-intl';
import { z } from 'zod';

import type { CuratorAssignment } from '@/app/[locale]/(private)/module/curatorlecturer/types';

export const createCuratorAssignmentSchema = (
  t: ReturnType<typeof useTranslations<'private.curatorlecturer.group-curator.administration'>>,
  assignments: CuratorAssignment[],
) =>
  z
    .object({
      employeeId: z.string().min(1, t('validation.lecturer-required')),
      startDate: z
        .string()
        .min(1, t('validation.required'))
        .pipe(z.iso.date({ error: t('validation.invalid-date') })),
      endDate: z
        .string()
        .min(1, t('validation.required'))
        .pipe(z.iso.date({ error: t('validation.invalid-date') })),
    })
    .refine(({ startDate, endDate }) => endDate >= startDate, {
      message: t('validation.date-order'),
      path: ['endDate'],
      abort: true,
    })
    .refine(
      ({ startDate, endDate }) =>
        !assignments.some((assignment) => {
          const existingStart = assignment.startDate.slice(0, 10);
          const existingEnd = assignment.endDate?.slice(0, 10);
          return existingStart <= endDate && (!existingEnd || existingEnd >= startDate);
        }),
      { message: t('validation.conflict'), path: ['startDate'] },
    );

export type CuratorAssignmentFormValues = z.infer<ReturnType<typeof createCuratorAssignmentSchema>>;
