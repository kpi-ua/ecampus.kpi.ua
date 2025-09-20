import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { getFacultyCertificates } from '@/actions/dean.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import React from 'react';
import { StudySheet } from './components/study-sheet';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'private.study-sheet' });

  return {
    title: t('title'),
  };
}

export default async function StudySheetPage() {
  const facultyCertificates = await getFacultyCertificates();
  const t = await getTranslations('private.facultycertificate');

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <StudySheet {...facultyCertificates} />
      </div>
    </SubLayout>
  );
}
