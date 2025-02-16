'use server';

import { getJWTPayload } from '@/lib/jwt';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { getUserDetails } from './auth.actions';
import { MenuItemMeta } from '@/types/menu-item-meta';
import { MODULES } from '@/lib/constants/modules';
import { ProfileArea } from '@/types/enums/profile-area';
import { Module } from '@/types/module';

const OLD_CAMPUS_URL = process.env.OLD_CAMPUS_URL;

const OLD_CAMPUS_PROFILE_AREA = {
  [ProfileArea.Employee]: 'tutor',
  [ProfileArea.Student]: 'student',
};

const composeUrl = (module: Module, profileArea: ProfileArea) => {
  if (module.isExternal) {
    return `${OLD_CAMPUS_URL}/${OLD_CAMPUS_PROFILE_AREA[profileArea]}/index.php?mode=${module.name}`;
  }

  return `/module/${module.name}`;
};

const getStaticMenuItems = async (): Promise<MenuItemMeta[][]> => {
  const t = await getTranslations('global.menu');

  return [
    [
      {
        name: 'main',
        title: t('main'),
        url: '/',
        isExternal: false,
      },
    ],
    [
      {
        name: 'profile',
        title: t('profile'),
        url: '/profile',
        isExternal: false,
      },
      {
        name: 'notice-board',
        title: t('notice-board'),
        url: '/notice-board',
        isExternal: false,
      },
      {
        name: 'feedback',
        title: t('feedback'),
        url: '/feedback',
        isExternal: false,
      },
      {
        name: 'settings',
        title: t('settings'),
        url: '/settings',
        isExternal: false,
      },
    ],
  ];
};

const getModuleMenuItems = async (): Promise<MenuItemMeta[]> => {
  try {
    const jwt = cookies().get('token')?.value;

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

    return availableModules.map((module) => {
      return {
        name: module.name,
        title: t(module.name),
        url: composeUrl(module, profileArea),
        isExternal: module.isExternal,
      } satisfies MenuItemMeta;
    });
  } catch (error) {
    return [];
  }
};

export const getUserMenuGroups = async () => {
  const staticMenuItems = await getStaticMenuItems();
  const modulesMenuItems = await getModuleMenuItems();

  if (!modulesMenuItems.length) {
    return staticMenuItems;
  }

  return [...staticMenuItems, modulesMenuItems];
};
