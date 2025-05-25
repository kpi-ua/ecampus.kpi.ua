export interface Subdivision {
  id: number;
  name?: string | null;
}

export interface Contact {
  name?: string | null;
  value?: string | null;
}

export interface UserInfo {
  id: number;
  fullName: string;
  photo?: string | null;
  credo?: string | null;
  profile?: string | null;
}

export interface Curator {
  userInfo: UserInfo;
  subdivisions: Subdivision[];
  contacts: Contact[];
}
