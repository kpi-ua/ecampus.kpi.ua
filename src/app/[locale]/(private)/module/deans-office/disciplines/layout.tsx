import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { TabsTrigger } from '@/components/ui/tabs';

import { DeansOfficeTabs } from '../components/deans-office-tabs';
import { INTL_NAMESPACE } from '../translations';

export default async function DisciplinesLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <DeansOfficeTabs
      basePath="/module/deans-office/disciplines"
      label={t('disciplines')}
      triggers={
        <>
          <TabsTrigger value="index">{t('disciplineSettings')}</TabsTrigger>
          <TabsTrigger value="missing">{t('missing')}</TabsTrigger>
        </>
      }
    >
      {children}
    </DeansOfficeTabs>
  );
}
