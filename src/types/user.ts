export interface User {
  modules: string[];
  position: string[];
  subdivision: string[];
  studyGroup?: string;
  sid: string;
  email: string;
  scientificInterest: string;
  username: string;
  tgAuthLinked: boolean;
  profiles: string[];
  id: number;
  userIdentifier: string;
  fullName: string;
  photo: string;
  credo?: string;
  profile?: string;
}