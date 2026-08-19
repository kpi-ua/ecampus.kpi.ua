import { ProfileArea } from '@/types/enums/profile-area';

export interface Module {
  name: string;
  isExternal: boolean | ((profileArea: ProfileArea) => boolean);
  group?: string;
}
