'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, usePathname } from '@/i18n/routing';

interface Props {
  children: ReactNode;
}

export const LecturerCuratorView = ({ children }: Props) => {
  const t = useTranslations('private.curatorlecturer');
  const pathname = usePathname();
  const isGroupCurator = pathname.startsWith('/module/curatorlecturer/groups');

  return (
    <div>
      <Tabs value={isGroupCurator ? 'group-curator' : 'study-groups'}>
        <TabsList className="mb-6 bg-white" size="small">
          <TabsTrigger value="study-groups" asChild>
            <Link prefetch={false} href="/module/curatorlecturer">
              {t('tabs.study-groups')}
            </Link>
          </TabsTrigger>
          <TabsTrigger value="group-curator" asChild>
            <Link prefetch={false} href="/module/curatorlecturer/groups">
              {t('tabs.group-curator')}
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
};
