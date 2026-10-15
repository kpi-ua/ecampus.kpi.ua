import { z } from 'zod';

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
