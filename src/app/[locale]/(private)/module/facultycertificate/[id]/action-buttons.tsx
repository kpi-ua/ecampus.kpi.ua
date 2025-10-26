'use client';
import { Button } from '@/components/ui/button';
import { Check, PencilRegular, Printer, X } from '@/app/images';
import { printCertificate } from '@/app/[locale]/(private)/module/facultycertificate/utils/print-certificate';
import React from 'react';
import { signCertificate, updateCertificate, UpdateCertificateBody } from '@/actions/certificates.actions';
import { Certificate } from '@/types/models/certificate/certificate';
import { useTranslations } from 'next-intl';
import { buttonDisableController } from '@/app/[locale]/(private)/module/facultycertificate/utils/button-state-controller';
import { RejectDialog } from '@/app/[locale]/(private)/module/facultycertificate/components/reject-dialog';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

interface Props {
  certificate: Certificate;
}

export default function ActionButtons({ certificate }: Props) {
  const t = useTranslations('private.facultycertificate');
  const { errorToast } = useServerErrorToast();

  const handleUpdateCertificate = async (id: number, body: UpdateCertificateBody) => {
    try {
      await updateCertificate(id, body);
    } catch (error) {
      errorToast();
    }
  };

  const handleSignClick = async (id: number) => {
    try {
      await signCertificate(id);
    } catch (error) {
      errorToast();
    }
  };
  
  const handlePrintClick = async () => {
    try {
      await printCertificate(certificate.id);
    } catch (error) {
      errorToast();
    }
  };

  const { shouldDisableRejectButton, shouldDisableSignButton,shouldDisablePrintButton, shouldDisableApproveButton } =
    buttonDisableController(certificate);

  return (
    <div className="flex flex-col-reverse flex-wrap gap-3 md:flex-row md:justify-end">
      <Button
        variant="secondary"
        className="mt-6 w-full md:w-[145px]"
        icon={<Printer />}
        disabled={shouldDisablePrintButton}
        onClick={handlePrintClick}
      >
        {t('button.print')}
      </Button>
      <Button variant="secondary"
        className="mt-6 w-full md:w-[145px]"
      
      size="small" disabled={shouldDisableSignButton} onClick={() => handleSignClick(certificate.id)}>
        <PencilRegular />
        {t('button.signed')}
      </Button>
      <RejectDialog
        certificate={certificate}
        handleUpdateCertificate={handleUpdateCertificate}
        triggerButton={
          <Button
            variant="primary"
            className="mt-6 w-full bg-red-500 hover:bg-red-600 active:border-red-700 active:bg-red-700 md:w-[145px]"
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
        className="mt-6 w-full md:w-[145px]"
        icon={<Check />}
      >
        {t('button.approve')}
      </Button>
    </div>
  );
}
