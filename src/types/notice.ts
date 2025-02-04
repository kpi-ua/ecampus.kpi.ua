import { Announcement } from '@/types/announcement';

export interface Notice extends Announcement {
  linkTitle?: string;
  start?: string;
  end?: string;
}
