import { z } from 'zod';

import type { AnnouncementCreate } from '../types';

/** HTML date or full ISO / RFC 3339 string accepted by `Date.parse`. */
const rfc3339LikeDate = (requiredMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .refine((s) => !Number.isNaN(Date.parse(s)), {
      message: 'Must be a valid ISO / RFC 3339 date',
    });

const announcementLinkFormSchema = z
  .object({
    title: z.string().max(30, 'Link title must be at most 30 characters'),
    uri: z.union([
      z.literal(''),
      z.string().url('Must be a valid URL').max(500, 'Link URL must be at most 500 characters'),
    ]),
  })
  .refine(
    (data) => {
      const hasTitle = !!data.title?.trim();
      const hasUri = !!data.uri?.trim();
      return (!hasTitle && !hasUri) || (hasTitle && hasUri);
    },
    { message: 'Both link title and URL must be provided together' },
  );

const announcementFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(700, 'Description must be at most 700 characters'),
  /** API: required field, `null` or URI; form may use `''` for empty — map with {@link toAnnouncementCreate}. */
  image: z.union([
    z.literal(''),
    z.null(),
    z.string().url('Must be a valid URL').max(500, 'Image URL must be at most 500 characters'),
  ]),
  link: announcementLinkFormSchema,
  start: rfc3339LikeDate('Start date is required'),
  end: rfc3339LikeDate('End date is required'),
  language: z.string().length(2, 'Language must be a 2-letter code'),
});

const filterFormSchema = z.object({
  roles: z.array(z.string()),
  studyForms: z.array(z.string()),
  courses: z.array(z.number()),
});

export const formSchema = z
  .object({
    announcement: announcementFormSchema,
    filter: filterFormSchema,
  })
  .refine((data) => new Date(data.announcement.start) <= new Date(data.announcement.end), {
    message: 'Start date must be before or equal to end date',
    path: ['announcement', 'end'],
  });

export type AnnouncementFormValues = z.infer<typeof formSchema>;

export const toAnnouncementCreate = (values: AnnouncementFormValues): AnnouncementCreate => {
  const { announcement, filter } = values;
  const { link, image, ...rest } = announcement;
  const hasLink = !!link.title?.trim() && !!link.uri?.trim();

  return {
    announcement: {
      ...rest,
      image: image === '' ? null : image,
      link: hasLink ? { title: link.title.trim(), uri: link.uri.trim() } : null,
    },
    filter,
  };
};
