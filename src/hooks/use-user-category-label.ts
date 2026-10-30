'use client';

import { useTranslations } from 'next-intl';

import { userCategoryLabelKey } from '@/lib/user-category.utils';

/** Labels an API role name (`GET /roles`, announcement filters) the way the header labels the user's own categories. */
export const useUserCategoryLabel = () => {
  const t = useTranslations('global.user-category');

  return (role: string) => {
    const key = userCategoryLabelKey(role);

    return key ? t(key) : role;
  };
};
