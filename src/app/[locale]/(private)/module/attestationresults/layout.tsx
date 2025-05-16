import { getTranslations } from 'next-intl/server';
import { Description, Heading1 } from '@/components/typography';
import React from 'react';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

interface Props {
  children: React.ReactNode;
}

export default async function AttestationResultsLayout({ children }: Props) {
  const t = await getTranslations('private.attestation-results');
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8">
        <Heading1>{t('title')}</Heading1>
        <Description>{t('subtitle')}</Description>
        {children}
      </div>
    </SubLayout>
  );
}
