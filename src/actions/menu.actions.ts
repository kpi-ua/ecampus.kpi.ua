'use server';

import { getJWTPayload } from '@/lib/jwt';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { getUserDetails } from './auth.actions';
import { MenuGroup } from '@/types/menu-item-meta';
import { MODULES } from '@/lib/constants/modules';
import { ProfileArea } from '@/types/enums/profile-area';
import { Module } from '@/types/module';
import { TOKEN_COOKIE_NAME } from '@/lib/constants/cookies';

const OLD_CAMPUS_URL = process.env.OLD_CAMPUS_URL;
const OLD_CAMPUS_PROFILE_AREA = {
  [ProfileArea.Employee]: 'tutor',
  [ProfileArea.Student]: 'student',
};

const byTitle = (a: MenuGroup, b: MenuGroup) => a.title.localeCompare(b.title);
const getIsExternal = (module: Module, profileArea: ProfileArea) =>
  typeof module.isExternal === 'function' ? module.isExternal(profileArea) : module.isExternal;

const composeUrl = (module: Module, profileArea: ProfileArea) => {
  if (getIsExternal(module, profileArea)) {
    return `${OLD_CAMPUS_URL}/${OLD_CAMPUS_PROFILE_AREA[profileArea]}/index.php?mode=${module.name}`;
  }

  return `/module/${module.name}`;
};

const composeMenuItem = (translation: (key: string) => string, module: Module, profileArea: ProfileArea): MenuGroup => ({
  name: module.name,
  title: translation(module.name),
  url: composeUrl(module, profileArea),
  external: getIsExternal(module, profileArea),
});

export const getModuleMenuSection = async (): Promise<MenuGroup[]> => {
  try {
    const resolvedCookies = await cookies();
    const jwt = resolvedCookies.get(TOKEN_COOKIE_NAME)?.value;

    if (!jwt) {
      return [];
    }

    const jwtPayload = getJWTPayload<CampusJwtPayload>(jwt);

    if (!jwtPayload) {
      return [];
    }

    const userDetails = await getUserDetails();

    if (!userDetails) {
      return [];
    }

    const t = await getTranslations('global.modules');
    const profileArea = userDetails.studentProfile ? ProfileArea.Student : ProfileArea.Employee;
    const availableModules = MODULES.filter((module) => jwtPayload.modules.includes(module.name));

    return availableModules.map((module) => composeMenuItem(t, module, profileArea)).sort(byTitle);
  } catch (error) {
    return [];
  }
};
