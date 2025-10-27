import React from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getTranslations } from 'next-intl/server';
import { getCertificate } from '@/actions/certificates.actions';
import { Description, Heading2, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Warning } from '@/app/images';
import { TextDivider } from '@/components/ui/text-divider';
import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/certificates/components/certificate-status-badge';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import ActionButtons from '@/app/[locale]/(private)/module/facultycertificate/[id]/action-buttons';

interface Props {
  params: Promise<{ id: number }>;
}

export default async function DocInfoPage({ params }: Props) {
  const { id } = await params;
  const certificate = await getCertificate(id);
  const t = await getTranslations('private.facultycertificate');
  const tTable = await getTranslations('private.facultycertificate.table');

  const compoundObject = {
    documentNumber: certificate.documentNumber,
    status: <CertificateStatusBadge certificate={certificate} />,
    fullname: certificate.requestedBy.fullName,
    purpose: certificate.purpose,
    originalRequired: certificate.originalRequired && <Badge variant="purple">{tTable('withstamp')}</Badge>,
  };

  return (
    <SubLayout pageTitle={certificate.documentNumber} breadcrumbs={[['/module/facultycertificate', t('title')]]}>
      <div className="col-span-7">
        <Heading2>{certificate.documentNumber}</Heading2>
        <Description>{t('details.subtitle', { name: certificate.requestedBy.fullName })}</Description>
        <div className="flex flex-col">
          <Card className="rounded-4 col-span-full w-full border border-neutral-200 bg-white p-6 shadow-none xl:col-span-5">
            {certificate.reason && (
              <Alert variant="destructive">
                <Warning width={20} height={20} />
                <AlertTitle>{t('alert.reason')}</AlertTitle>
                <AlertDescription>{certificate.reason}</AlertDescription>
              </Alert>
            )}
            <div className="mt-6 flex flex-col gap-6">
              {Object.entries(compoundObject).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                  <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                    {tTable(key)}:
                  </Paragraph>
                  <Paragraph className="m-0 font-medium">{value}</Paragraph>
                </div>
              ))}
            </div>
            <TextDivider />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                {tTable('created')}:
              </Paragraph>
              <Paragraph className="m-0 font-medium">
                {dayjs(certificate.created).format('DD.MM.YYYY, HH:mm')}
              </Paragraph>
            </div>
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                {tTable('updatedAt')}:
              </Paragraph>
              <Paragraph className="m-0 font-medium">
                {certificate.updatedAt && dayjs(certificate.updatedAt).format('DD.MM.YYYY, HH:mm')}
              </Paragraph>
            </div>
            <TextDivider />
            <ActionButtons certificate={certificate} />
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
