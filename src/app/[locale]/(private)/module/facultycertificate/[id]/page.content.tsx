'use client';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Check, Printer, Warning, X } from '@/app/images';
import { printCertificate } from '@/app/[locale]/(private)/module/facultycertificate/utils/print-certificate';
import { Card } from '@/components/ui/card';
import React from 'react';
import { updateCertificate, UpdateCertificateBody } from '@/actions/dean.actions';
import { DeanCertificate } from '@/types/models/dean/dean-certificate';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { buttonDisableController } from '@/app/[locale]/(private)/module/facultycertificate/utils/button-state-controller';
import { Badge } from '@/components/ui/badge';
import { TextDivider } from '@/components/ui/text-divider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RejectDialog } from '@/app/[locale]/(private)/module/facultycertificate/components/reject-dialog';

interface Props {
  certificate: DeanCertificate;
}

export default function DocInfoPageContent({ certificate }: Props) {
  const t = useTranslations('private.facultycertificate');
  const tTable = useTranslations('private.facultycertificate.table');
  const handleUpdateCertificate = async (id: number, body: UpdateCertificateBody) => {
    try {
      await updateCertificate(id, body);
    } catch (error) {
      console.error('Error updating certificate:', error);
    }
  };

  const compound = {
    documentNumber: certificate.documentNumber,
    status: certificate.status,
    fullname: certificate.requestedBy.fullName,
    purpose: certificate.purpose,
    originalRequired: certificate.originalRequired && <Badge variant="purple">{tTable('withstamp')}</Badge>,
  };

  const { shouldDisableRejectButton, shouldDisablePrintButton, shouldDisableApproveButton } =
    buttonDisableController(certificate);

  return (
    <>
      <Card className="rounded-4 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {certificate.reason && (
          <Alert variant="destructive">
            <Warning width={20} height={20} />
            <AlertTitle>{t('alert.reason')}</AlertTitle>
            <AlertDescription>{certificate.reason}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex flex-col gap-6">
          {Object.entries(compound).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">{tTable(key)}:</Paragraph>
              <Paragraph className="m-0 font-medium">{value}</Paragraph>
            </div>
          ))}
        </div>

        <TextDivider />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">{tTable('created')}:</Paragraph>
          <Paragraph className="m-0 font-medium">{dayjs(certificate.created).format('DD.MM.YYYY')}</Paragraph>
        </div>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
            {tTable('updatedAt')}:
          </Paragraph>
          <Paragraph className="m-0 font-medium">{dayjs(certificate.updatedAt).format('DD.MM.YYYY')}</Paragraph>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="mt-6"
            icon={<Printer />}
            disabled={shouldDisablePrintButton}
            onClick={() => printCertificate(certificate.id)}
          >
            {t('button.print')}
          </Button>
          <RejectDialog
            certificate={certificate}
            handleUpdateCertificate={handleUpdateCertificate}
            triggerButton={
              <Button
                variant="primary"
                className="mt-6 bg-red-500 hover:bg-red-600 active:border-red-700 active:bg-red-700"
                icon={<X />}
                disabled={shouldDisableRejectButton}
              >
                {t('button.reject')}
              </Button>
            }
          />
          <Button
            onClick={() => handleUpdateCertificate(certificate.id, { approve: true, reason: '' })}
            disabled={shouldDisableApproveButton}
            variant="primary"
            className="mt-6"
            icon={<Check />}
          >
            {t('button.approve')}
          </Button>
        </div>
      </Card>
    </>
  );
}
