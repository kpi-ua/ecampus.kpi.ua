import { ProfileArea } from '@/types/enums/profile-area';

export interface Module {
  name: string;
  isExternal: boolean | ((profileArea: ProfileArea) => boolean);
  group?: string;
  /** Route of a module served by this app when it is not the conventional /module/<name>. */
  url?: string;
}
