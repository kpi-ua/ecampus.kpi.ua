import React from 'react';
import CertificatePageContent from '@/app/[locale]/(private)/module/certificates/page.content';
import { getCertificateList, getCertificateTypes } from '@/actions/certificates.actions';
import { LocaleProps } from '@/types/locale-props';
import { getTranslations } from 'next-intl/server';

const INTL_NAMESPACE = 'private.certificate';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function CertificatePage() {
  const certificates = await getCertificateList();
  const types = await getCertificateTypes();
  return <CertificatePageContent certificateTypes={types} certificates={certificates} />;
}
