import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { LecturerCuratorView } from './components/lecturer-curator-view';

interface Props {
  children: ReactNode;
}

export default async function CuratorLecturerLayout({ children }: Props) {
  const t = await getTranslations('private.curatorlecturer');
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full px-2 sm:px-4 md:px-0">
        <LecturerCuratorView>{children}</LecturerCuratorView>
      </div>
    </SubLayout>
  );
}
