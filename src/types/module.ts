import { ProfileArea } from '@/types/enums/profile-area';

export interface Module {
  name: string;
  isExternal: boolean | ((profileArea: ProfileArea) => boolean);
  group?: string;
  // Fixed old Campus page (relative to OLD_CAMPUS_URL), opened regardless of the profile area.
  legacyPath?: string;
}
