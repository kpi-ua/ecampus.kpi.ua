export interface AnnouncementLink {
  uri: string;
  title: string;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  image?: string;
  link?: AnnouncementLink;
  start?: Date;
  end?: Date;
  language?: string;
}

/**
 * Targeting filter persisted alongside an announcement. Empty arrays mean
 * "no restriction"; non-empty means "only this audience".
 */
export interface AnnouncementFilter {
  courses: number[];
  roles: string[];
  studyForms: string[];
}

/**
 * Single row returned by `GET /announcements/admin`. Pairs the announcement
 * with its targeting filter so the admin grid can show audience info that
 * the user-facing list does not expose.
 */
export interface AdminAnnouncementItem {
  announcement: Announcement;
  filter: AnnouncementFilter;
}
