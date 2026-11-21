import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

export default async function Layout({ children }: { children: ReactNode }) {
  const t = await getTranslations('global.modules');
  return (
    <SubLayout pageTitle={t('vedomostadmin')}>
      <div className="col-span-full min-w-0">{children}</div>
    </SubLayout>
  );
}
