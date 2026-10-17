import type { useTranslations } from 'next-intl';
import { z } from 'zod';

export const createCuratorAssignmentSchema = (
  t: ReturnType<typeof useTranslations<'private.curatorlecturer.group-curator.administration'>>,
) =>
  z.object({
    employeeId: z.string().min(1, t('validation.lecturer-required')),
    startDate: z
      .string()
      .min(1, t('validation.required'))
      .pipe(z.iso.date({ error: t('validation.invalid-date') })),
    endDate: z
      .string()
      .min(1, t('validation.required'))
      .pipe(z.iso.date({ error: t('validation.invalid-date') })),
  });

export type CuratorAssignmentFormValues = z.infer<ReturnType<typeof createCuratorAssignmentSchema>>;
