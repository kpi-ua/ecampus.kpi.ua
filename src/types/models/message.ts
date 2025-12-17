import { EntityIdName } from '@/types/models/entity-id-name';

export interface Message {
  id: number;
  sender: EntityIdName;
  recipient: EntityIdName;
  subject: string;
  content: string;
  isImportant: boolean;
  isRead: boolean;
  createdAt: string;
}
