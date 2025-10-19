import { z } from 'zod';

export const formSchema = z
  .object({
    announcement: z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      image: z.string().url('Must be a valid URL').optional(),
      link: z
        .object({
          title: z.string().optional(),
          uri: z.string().url('Must be a valid URL').optional(),
        })
        .refine(
          (data) => {
            const hasTitle = !!data.title?.trim();
            const hasUri = !!data.uri?.trim();
            // Allow either both empty or both filled. This is clearer and explicit.
            return (!hasTitle && !hasUri) || (hasTitle && hasUri);
          },
          { message: 'Both link title and URL must be provided together' },
        )
        .optional(),
      start: z.string().min(1, 'Start date is required'),
      end: z.string().min(1, 'End date is required'),
      language: z.string().min(1, 'Language is required'),
    }),
    filter: z.object({
      roles: z.array(z.string()).optional(),
      groups: z.array(z.string()).optional(),
      studyForms: z.array(z.string()).optional(),
      subdivisions: z.array(z.number()).optional(),
      courses: z.array(z.number()).optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.announcement.start && data.announcement.end) {
        return new Date(data.announcement.start) <= new Date(data.announcement.end);
      }
      return true;
    },
    {
      message: 'Start date must be before or equal to end date',
      path: ['endDate'],
    },
  );
