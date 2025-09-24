import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { getFacultyCertificates } from '@/actions/dean.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import React from 'react';
import { CertificateSheet } from './components/certificate-sheet';

const INTL_NAMESPACE = 'private.facultycertificate';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function FacultyCertificatePage() {
  const facultyCertificates = await getFacultyCertificates();
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <CertificateSheet {...facultyCertificates} />
      </div>
    </SubLayout>
  );
}
