import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { TabsTrigger } from '@/components/ui/tabs';
import { type LocaleProps } from '@/types/locale-props';

import { DeansOfficeTabs } from './components/deans-office-tabs';
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
      <div className="col-span-full min-w-0 space-y-6">
        <Heading2>{t('title')}</Heading2>
        <DeansOfficeTabs
          basePath="/module/deans-office"
          label={t('title')}
          triggers={
            <>
              <TabsTrigger value="index">{t('roster')}</TabsTrigger>
              <TabsTrigger value="disciplines">{t('disciplines')}</TabsTrigger>
              <TabsTrigger value="reports">{t('reports')}</TabsTrigger>
              <TabsTrigger value="groups">{t('groups')}</TabsTrigger>
            </>
          }
        >
          <Card className="space-y-5 p-6">{children}</Card>
        </DeansOfficeTabs>
      </div>
    </SubLayout>
  );
}
