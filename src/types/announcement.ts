export interface Announcement {
  id: number;
  title: string;
  description: string;
  image?: string;
  link?: string;
  linkTitle?: string;
  start?: Date;
  end?: Date;
}
