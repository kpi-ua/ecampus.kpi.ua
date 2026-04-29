'use server';

import { revalidatePath } from 'next/cache';
import { AnnouncementCreate } from '@/app/[locale]/(private)/module/announcementseditor/types';
import { campusFetch } from '@/lib/client';
import { isOutdated } from '@/lib/date.utils';
import { AdminAnnouncementItem, Announcement } from '@/types/models/announcement';
import { Group } from '@/types/models/group';

const ANNOUNCEMENTS_EDITOR_PATH = '/[locale]/(private)/module/announcementseditor';

export type AdminAnnouncementsLanguage = 'all' | 'uk' | 'en';

export type AdminAnnouncementsSort = 'EndDesc' | 'EndAsc' | 'StartDesc' | 'StartAsc' | 'TitleAsc';

export interface AdminAnnouncementsQuery {
  search?: string;
  language?: AdminAnnouncementsLanguage;
  page?: number;
  pageSize?: number;
  sort?: AdminAnnouncementsSort;
}

export interface AdminAnnouncementsResult {
  items: AdminAnnouncementItem[];
  total: number;
}

export const getAdminAnnouncements = async (query: AdminAnnouncementsQuery): Promise<AdminAnnouncementsResult> => {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.language && query.language !== 'all') {
      // Backend enum is PascalCase (Uk/En); the model binder is case-insensitive.
      params.set('language', query.language);
    }
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));
    if (query.sort) params.set('sort', query.sort);

    const qs = params.toString();
    const url = qs ? `announcements/admin?${qs}` : 'announcements/admin';
    const response = await campusFetch<AdminAnnouncementItem[]>(url);

    if (!response.ok) {
      return { items: [], total: 0 };
    }

    const items = (await response.json()) as AdminAnnouncementItem[];
    const total = parseInt(response.headers.get('x-total-count') ?? '0', 10) || 0;

    return { items, total };
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    return { items: [], total: 0 };
  }
};

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
    revalidatePath(ANNOUNCEMENTS_EDITOR_PATH, 'page');
    return responseJson;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id: number, data: AnnouncementCreate): Promise<void> => {
  try {
    const response = await campusFetch(`announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update announcement: ${response.status} ${response.statusText}`);
    }
    revalidatePath(ANNOUNCEMENTS_EDITOR_PATH, 'page');
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: number): Promise<void> => {
  try {
    const response = await campusFetch(`announcements/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete announcement: ${response.status} ${response.statusText}`);
    }
    revalidatePath(ANNOUNCEMENTS_EDITOR_PATH, 'page');
  } catch (error) {
    console.error('Error deleting announcement:', error);
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
