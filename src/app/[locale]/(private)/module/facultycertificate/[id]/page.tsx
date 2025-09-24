import React from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getTranslations } from 'next-intl/server';
import { getCertificate } from '@/actions/dean.actions';
import DocInfoPageContent from '@/app/[locale]/(private)/module/facultycertificate/[id]/page.content';
import { Description, Heading2 } from '@/components/typography';

interface Props {
  params: Promise<{ id: number }>;
}

export default async function DocInfoPage({ params }: Props) {
  const { id } = await params;
  const certificate = await getCertificate(id);
  const t = await getTranslations('private.facultycertificate');

  return (
    <SubLayout pageTitle={certificate.documentNumber} breadcrumbs={[['/module/facultycertificate', t('title')]]}>
      <div className="col-span-7">
        <Heading2>{certificate.documentNumber}</Heading2>
        <Description>{t('details.subtitle', { name: certificate.requestedBy.fullName })}</Description>
        <div className="flex flex-col">
          <DocInfoPageContent certificate={certificate} />
        </div>
      </div>
    </SubLayout>
  );
}
