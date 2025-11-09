import { Message } from '@/types/models/message';

export interface State {
  mails: Message[];
  selectedRows: number[];
  selectedMail: Message | null;
  isDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isRefreshing: boolean;
}

export type Action =
  | { type: 'setIsDialogOpen'; isDialogOpen: boolean }
  | { type: 'setIsDeleteDialogOpen'; isDeleteDialogOpen: boolean }
  | { type: 'setSelectedRows'; selectedRows: number[] }
  | { type: 'setSelectedMail'; selectedMail: Message | null }
  | { type: 'setIsRefreshing'; isRefreshing: boolean }
  | { type: 'setMails'; mails: Message[] };
