export interface ContactType {
  id: number;
  name: string;
}

export interface Contact {
  id: number;
  type: ContactType;
  value: string;
}
