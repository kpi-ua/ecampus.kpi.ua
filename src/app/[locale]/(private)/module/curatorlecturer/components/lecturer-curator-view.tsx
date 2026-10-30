'use client';

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { usePermission } from '@/components/permission-provider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';

import { CURATOR_ADMIN_MODULE } from '../constants';

interface Props {
  children: ReactNode;
  activeTab: 'study-groups' | 'groups' | 'administration';
}

export const LecturerCuratorView = ({ children, activeTab }: Props) => {
  const t = useTranslations('private.curatorlecturer');
  const canAdmin = usePermission(CURATOR_ADMIN_MODULE);

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
          <Show when={canAdmin}>
            <TabsTrigger value="administration" asChild>
              <Link prefetch={false} href="/module/curatorlecturer/administration">
                {t('tabs.administration')}
              </Link>
            </TabsTrigger>
          </Show>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
};
