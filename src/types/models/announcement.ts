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
}
