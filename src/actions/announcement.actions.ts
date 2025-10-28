'use server';

import { campusFetch } from '@/lib/client';
import { isOutdated } from '@/lib/date.utils';
import { Announcement } from '@/types/models/announcement';
import { AnnouncementCreate } from '@/app/[locale]/(private)/module/announcements/types';
import { Group } from '@/types/models/group';
import { Subdivision } from '@/types/models/subdivision';

export const getAnnouncements = async ({ excludeOutdated = false }: { excludeOutdated?: boolean } = {}) => {
  try {
    const response = await campusFetch<Announcement[]>('announcements');

    if (!response.ok) {
      return [];
    }

    const announcements = await response.json();

    const sortedAnnouncements = announcements.sort((a, b) => {
      return new Date(b.end || 0).getTime() - new Date(a.end || 0).getTime();
    });

    if (excludeOutdated) {
      return sortedAnnouncements.filter((announcement) => !isOutdated(announcement.end));
    }

    return sortedAnnouncements;
  } catch (error) {
    return [];
  }
};

export const createAnnouncement = async (data: AnnouncementCreate): Promise<number> => {
  try {
    const body = JSON.stringify(data);
    const response = await campusFetch('announcements', {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to create announcement: ${response.status} ${response.statusText}`);
    }
    const responseJson = (await response.json()) as number;
    return responseJson;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await campusFetch<string[]>('/roles');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const getStudyForms = async () => {
  try {
    const response = await campusFetch<string[]>('/study-forms');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching study forms:', error);
    return [];
  }
};

export const getAllGroups = async () => {
  try {
    const response = await campusFetch<Group[]>('group/all');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const getSubdivisions = async () => {
  const response = await campusFetch<Subdivision[]>('/subdivision/faculty');
  if (!response.ok) {
    return [];
  }
  return response.json();
};

export const getCourses = async () => {
  try {
    const response = await campusFetch<number[]>('/courses');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};
