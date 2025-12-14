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
import { group } from 'radash';

const OLD_CAMPUS_URL = process.env.OLD_CAMPUS_URL;
const OLD_CAMPUS_PROFILE_AREA = {
  [ProfileArea.Employee]: 'tutor',
  [ProfileArea.Student]: 'student',
};
type Translation = Awaited<ReturnType<typeof getTranslations>>;

const getIsExternal = (module: Module, profileArea: ProfileArea) =>
  typeof module.isExternal === 'function' ? module.isExternal(profileArea) : module.isExternal;

const composeUrl = (module: Module, profileArea: ProfileArea) => {
  if (getIsExternal(module, profileArea)) {
    return `${OLD_CAMPUS_URL}/${OLD_CAMPUS_PROFILE_AREA[profileArea]}/index.php?mode=${module.name}`;
  }

  return `/module/${module.name}`;
};

const getModuleMenuItemComposer =
  (translation: Translation) =>
  (module: Module, profileArea: ProfileArea): MenuGroup => ({
    name: module.name,
    title: translation(module.name),
    url: composeUrl(module, profileArea),
    external: getIsExternal(module, profileArea),
  });

const getMenuGroupComposer = (translation: Translation) => (modules: Module[], profileArea: ProfileArea) => {
  const composeModuleMenuItem = getModuleMenuItemComposer(translation);

  return modules.map((module) => composeModuleMenuItem(module, profileArea));
};

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
    const groups = group(availableModules, (module) => module.group || module.name);

    const composeMenuGroup = getMenuGroupComposer(t);
    const composeModuleMenuItem = getModuleMenuItemComposer(t);

    return Object.entries(groups).reduce((acc: MenuGroup[], [group, modules]) => {
      if (!modules) {
        return acc;
      }

      if (modules.length === 1) {
        return [...acc, composeModuleMenuItem(modules[0], profileArea)];
      }

      const menuGroupItems = composeMenuGroup(modules, profileArea);

      return [
        ...acc,
        {
          name: `_group.${group}`,
          title: t(`_groups.${group}`),
          url: `#${group}`,
          submenu: menuGroupItems,
        } satisfies MenuGroup,
      ];
    }, []);
  } catch (error) {
    return [];
  }
};
