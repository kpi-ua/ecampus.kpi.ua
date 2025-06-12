import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Heading1, Paragraph } from '@/components/typography';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

interface Props {
  children: React.ReactNode;
}

export default async function SessionLayout({ children }: Props) {
  const t = await getTranslations('private.vedomoststud');

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-9">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        {children}
      </div>
    </SubLayout>
  );
}
