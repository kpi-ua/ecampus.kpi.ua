'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

interface Props {
  children: ReactNode;
  activeTab: 'study-groups' | 'groups';
}

export const LecturerCuratorView = ({ children, activeTab }: Props) => {
  const t = useTranslations('private.curatorlecturer');

  return (
    <div>
      <Tabs value={activeTab}>
        <TabsList className="mb-6 bg-white" size="small">
          <TabsTrigger value="study-groups" asChild>
            <Link prefetch={false} href="/module/curatorlecturer">
              {t('tabs.study-groups')}
            </Link>
          </TabsTrigger>
          <TabsTrigger value="groups" asChild>
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
