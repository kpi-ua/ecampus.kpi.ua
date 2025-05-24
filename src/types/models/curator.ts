export interface Curator {
  userInfo: {
    id: number;
    fullName: string;
    photo: string;
    credo: string;
    profile?: string;
  };
  subdivisions: { id: number; name: string }[];
  contacts: { name: string; value: string }[];
}
