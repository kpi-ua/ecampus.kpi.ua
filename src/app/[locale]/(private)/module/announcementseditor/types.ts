export interface FilterOption {
  id: number;
  name: string;
  value?: string;
}

export interface AnnouncementCreateFilter {
  courses?: number[];
  groups?: string[];
  roles?: string[];
  studyForms?: string[];
}

export interface AnnouncementCreateData {
  title: string;
  description: string;
  image?: string;
  link?: {
    uri?: string;
    title?: string;
  };
  start: string;
  end: string;
  language: string;
}

export interface AnnouncementCreate {
  announcement: AnnouncementCreateData;
  filter: AnnouncementCreateFilter;
}
