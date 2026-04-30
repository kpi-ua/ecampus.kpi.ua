import { z } from 'zod';

/**
 * Form schema for the Grant Rights dialog. The flat shape stays friendly to
 * react-hook-form `defaultValues`; the refine clause enforces that
 * `subdivisionId` is supplied for Faculty scope. The grant action also
 * runs the same check at the wire boundary.
 */
export const grantRightsSchema = z
  .object({
    userAccountId: z.number().int().positive('grant.errors.userRequired'),
    scope: z.enum(['Faculty', 'University']),
    subdivisionId: z.number().int().positive().optional(),
    studyingYearId: z.number().int().positive('grant.errors.yearRequired'),
    loadIds: z.array(z.number().int().positive()).min(1, 'grant.errors.loadsRequired'),
  })
  .refine((d) => d.scope === 'University' || (d.subdivisionId != null && d.subdivisionId > 0), {
    message: 'grant.errors.subdivisionRequired',
    path: ['subdivisionId'],
  });

export type GrantRightsFormValues = z.infer<typeof grantRightsSchema>;
