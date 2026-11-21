import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { type LocaleProps } from '@/types/locale-props';

import { DeansOfficeNavigation } from './components/deans-office-navigation';
import { INTL_NAMESPACE } from './translations';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function DeansOfficeLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-full flex min-w-0 flex-col gap-4">
        <Heading2>{t('title')}</Heading2>
        <DeansOfficeNavigation>
          <Card className="flex min-w-0 flex-col gap-6 p-4 sm:p-6">{children}</Card>
        </DeansOfficeNavigation>
      </div>
    </SubLayout>
  );
}
