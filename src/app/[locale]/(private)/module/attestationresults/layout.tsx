import { getTranslations } from 'next-intl/server';
import React from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';

interface Props {
  children: React.ReactNode;
}

export default async function AttestationResultsLayout({ children }: Props) {
  const t = await getTranslations('private.attestation-results');
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        {children}
      </div>
    </SubLayout>
  );
}
