interface Subdivision {
  id: number;
  name?: string;
}

interface Contact {
  name?: string;
  value?: string;
}

interface UserInfo {
  id: number;
  fullName: string;
  photo?: string;
  credo?: string;
  profile?: string;
}

export interface Curator {
  userInfo: UserInfo;
  subdivisions: Subdivision[];
  contacts: Contact[];
}
