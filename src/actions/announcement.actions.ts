'use server';

import { campusFetch } from '@/lib/client';
import { Announcement } from '@/types/announcement';
import { isOutdated } from '@/lib/date.utils';

export const getAnnouncements = async ({ filterEnabled = false }: { filterEnabled?: boolean } = {}) => {
  try {
    const response = await campusFetch<Announcement[]>('announcements');

    console.log('response', response);

    if (!response.ok) {
      return [];
    }

    const announcements = await response.json();

    const sortedAnnouncements = announcements.toSorted((a, b) => {
      return new Date(b.end || 0).getTime() - new Date(a.end || 0).getTime();
    });

    if (filterEnabled) {
      return sortedAnnouncements.filter((announcement) => !isOutdated(announcement.end));
    }

    return sortedAnnouncements;
  } catch (error) {
    console.log('error', error);
    return [];
  }
};
