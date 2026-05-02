import type { z } from 'zod';

import type { AdminAnnouncementItem } from '@/types/models/announcement';

import { formSchema } from '../components/schema';

export type AnnouncementFormValuesFromSchema = z.infer<typeof formSchema>;

const toIsoDate = (value: Date | string | undefined) => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const buildAnnouncementFormValues = (item: AdminAnnouncementItem): AnnouncementFormValuesFromSchema => ({
  announcement: {
    title: item.announcement.title,
    description: item.announcement.description ?? '',
    image: item.announcement.image ?? '',
    link: {
      title: item.announcement.link?.title ?? '',
      uri: item.announcement.link?.uri ?? '',
    },
    start: toIsoDate(item.announcement.start),
    end: toIsoDate(item.announcement.end),
    language: item.announcement.language ?? 'uk',
  },
  filter: {
    roles: item.filter.roles ?? [],
    studyForms: item.filter.studyForms ?? [],
    courses: item.filter.courses ?? [],
  },
});
