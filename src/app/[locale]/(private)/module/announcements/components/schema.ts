import { z } from 'zod';

export const formSchema = z
  .object({
    announcement: z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      image: z.string().url('Must be a valid URL').min(1, 'Image is required'),
      link: z.object({
        title: z.string().min(1, 'Link title is required'),
        uri: z.string().url('Must be a valid URL').min(1, 'Link is required'),
      }),
      start: z.string().min(1, 'Start date is required'),
      end: z.string().min(1, 'End date is required'),
      language: z.string().min(1, 'Language is required'),
    }),
    filter: z.object({
      roles: z.array(z.string()).optional().default([]),
      groups: z.array(z.string()).optional().default([]),
      studyForms: z.array(z.string()).optional().default([]),
      subdivisions: z.array(z.number()).optional().default([]),
      courses: z.array(z.number()).optional().default([]),
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
