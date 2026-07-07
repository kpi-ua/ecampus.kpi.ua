'use server';

import { revalidatePath } from 'next/cache';
import { AnnouncementCreate } from '@/app/[locale]/(private)/module/announcementseditor/types';
import { campusFetch } from '@/lib/client';
import { isOutdated } from '@/lib/date.utils';
import { AdminAnnouncementItem, Announcement } from '@/types/models/announcement';
import { LOCALE } from '@/i18n/routing';

// URL pathname (no [locale] prefix, no route group). Matches the convention
// used by other actions in the repo, e.g. certificates.actions revalidating
// `/module/certificates`.
const ANNOUNCEMENTS_EDITOR_PATH = '/module/announcementseditor';

export interface AdminAnnouncementsQuery {
  search?: string;
  language?: LOCALE;
  page?: number;
  pageSize?: number;
}

export interface AdminAnnouncementsResult {
  items: AdminAnnouncementItem[];
  total: number;
}

export const getAdminAnnouncements = async (query: AdminAnnouncementsQuery): Promise<AdminAnnouncementsResult> => {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.language) {
      // Backend enum is PascalCase (Uk/En); the model binder is case-insensitive.
      params.set('language', query.language);
    }
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));

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

export const getAdminAnnouncementById = async (id: number): Promise<AdminAnnouncementItem> => {
  try {
    const response = await campusFetch<AdminAnnouncementItem>(`announcements/admin/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch announcement");
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching announcement by id:', error);
    throw new Error("Failed to fetch announcement");
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
    revalidatePath(ANNOUNCEMENTS_EDITOR_PATH, 'layout');
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
    revalidatePath(ANNOUNCEMENTS_EDITOR_PATH, 'layout');
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
    revalidatePath(ANNOUNCEMENTS_EDITOR_PATH, 'layout');
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await campusFetch<string[]>('roles');
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
    const response = await campusFetch<string[]>('study-forms');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching study forms:', error);
    return [];
  }
};

export const getCourses = async () => {
  try {
    const response = await campusFetch<number[]>('courses');
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};
