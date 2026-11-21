import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Link } from '@/i18n/routing';

export default async function Layout({ children }: { children: ReactNode }) {
  const t = await getTranslations('private.session-administration');
  const menu = await getTranslations('global.menu');
  return (
    <SubLayout pageTitle={menu('vedomostadmin')}>
      <div className="col-span-full min-w-0">
        <nav className="mb-4 flex flex-wrap gap-4" aria-label={menu('vedomostadmin')}>
          <Link className="underline" href="/module/vedomostadmin">
            {t('monitoring')}
          </Link>
          <Link className="underline" href="/module/vedomostadmin/instructions">
            {t('instructions')}
          </Link>
        </nav>
        {children}
      </div>
    </SubLayout>
  );
}
