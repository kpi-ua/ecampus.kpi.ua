import { ContactType } from './contact';

export interface Subdivision {
  id: number;
  name: string;
}

export interface Position {
  name: string;
  subdivision: Subdivision;
  employment: 'FullTime' | 'PartTimeInternal' | 'PartTimeExternal';
}

export interface ColleagueContact {
  userAccountId: number;
  fullName: string;
  positions: Position[];
  contactSource: string;
  intellectProfileEnabled: boolean;
  intellectProfile: string | null;
  contacts: {
    contactTypeId: number;
    value: string;
  }[];
}

export type { ContactType };
