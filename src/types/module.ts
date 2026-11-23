import { ProfileArea } from '@/types/enums/profile-area';

export interface Module {
  name: string;
  isExternal: boolean | ((profileArea: ProfileArea) => boolean);
  group?: string;
  // Profile areas that see the module in the menu; all of them when omitted.
  profileAreas?: ProfileArea[];
  // Fixed old Campus page (relative to OLD_CAMPUS_URL) for external modules, bypassed in development.
  legacyPath?: string;
}
