export interface Message {
  id: number;
  sender: {
    id: number;
    name: string;
  };
  recipient: {
    id: number;
    name: string;
  };
  subject: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
}
