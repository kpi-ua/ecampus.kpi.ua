'use server';

import { campusFetch } from '@/lib/client';
import { Announcement } from '@/types/models/announcement';

export const getAnnouncements = async () => {
  try {
    const response = await campusFetch<Announcement[]>('announcements');

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    return [];
  }
};
