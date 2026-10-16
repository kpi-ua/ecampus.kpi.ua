import { ProfileArea } from '@/types/enums/profile-area';

export interface Module {
  name: string;
  isExternal: boolean | ((profileArea: ProfileArea) => boolean);
  group?: string;
  // Old Campus mode to open when it differs from the module name.
  legacyMode?: string;
}
