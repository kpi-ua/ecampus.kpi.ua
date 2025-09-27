import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { getFacultyCertificates, getOtherFacultyCertificate } from '@/actions/dean.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import React from 'react';
import { DeanCeritificateKey, PAGE_SIZE } from './constants';
import FacultyCertificatePageContent from './page.content';

const INTL_NAMESPACE = 'private.facultycertificate';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function FacultyCertificatePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const selectedTab = resolvedSearchParams.tab || DeanCeritificateKey.All;
  const searchFilter = resolvedSearchParams.search || '';

  const facultyCertificates = await getFacultyCertificates({
    filter: searchFilter,
    page: resolvedSearchParams.page,
    size: PAGE_SIZE.toString(),
  });

  const otherFacultyCertificates = await getOtherFacultyCertificate();

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>

        <FacultyCertificatePageContent
          createdCertificates={otherFacultyCertificates.createdCertificates}
          allCertificates={facultyCertificates.allCertificates}
          approvedCertificates={otherFacultyCertificates.approvedCertificates}
          rejectedCertificates={otherFacultyCertificates.rejectedCertificates}
          selectedTab={selectedTab}
          totalCount={facultyCertificates.totalCount}
          searchFilter={searchFilter}
        />
      </div>
    </SubLayout>
  );
}
