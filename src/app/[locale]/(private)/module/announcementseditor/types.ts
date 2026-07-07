import { LOCALE } from "@/i18n/routing";

export type AdminAnnouncementsLanguage = 'all' | LOCALE;

export interface AnnouncementCreateFilter {
  courses: number[];
  roles: string[];
  studyForms: string[];
}

export interface AnnouncementCreateData {
  title: string;
  description: string;
  image: string | null;
  link: { title: string; uri: string } | null;
  start: string;
  end: string;
  language: string;
}

export interface AnnouncementCreate {
  announcement: AnnouncementCreateData;
  filter: AnnouncementCreateFilter;
}
