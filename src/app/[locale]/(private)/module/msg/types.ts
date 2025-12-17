import { z } from 'zod';

export const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type Option = z.infer<typeof optionSchema>;
