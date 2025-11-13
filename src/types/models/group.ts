import { Cathedra } from './cathedra';

interface Curator {
  id: number;
  userIdentifier: string;
  fullName: string;
  photo: string;
  credo: string;
  profile?: string;
}

export interface Group {
  id: string | number;
  name: string;
  faculty: string;
  cathedra?: Cathedra;
  curator?: Curator;
}
