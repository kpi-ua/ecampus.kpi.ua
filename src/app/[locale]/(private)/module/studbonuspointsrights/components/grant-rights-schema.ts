import { z } from 'zod';

/**
 * Form schema for the Grant Rights form. Built with the form's `t`, so the
 * messages are localized at the source and `<FormMessage />` renders them
 * as-is. The flat shape stays friendly to react-hook-form `defaultValues`;
 * the refine clause enforces that `subdivisionId` is supplied for Faculty
 * scope. The grant action also runs the same check at the wire boundary.
 */
export const createGrantRightsSchema = (t: (key: string) => string) =>
  z
    .object({
      userAccountId: z.number().int().positive(t('errors.userRequired')),
      scope: z.enum(['Faculty', 'University']),
      subdivisionId: z.number().int().positive().optional(),
      studyingYearId: z.number().int().positive(t('errors.yearRequired')),
      loadIds: z.array(z.number().int().positive()).min(1, t('errors.loadsRequired')),
    })
    .refine((d) => d.scope === 'University' || (d.subdivisionId != null && d.subdivisionId > 0), {
      message: t('errors.subdivisionRequired'),
      path: ['subdivisionId'],
    });

export type GrantRightsFormValues = z.infer<ReturnType<typeof createGrantRightsSchema>>;
