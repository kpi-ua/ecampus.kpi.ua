'use client';

import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { saveAsBlob } from '@/lib/save-as-blob';

import { AttestationReportQuery } from '../types';

interface Props {
  query: AttestationReportQuery;
}

export const ReportExportButton = ({ query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const { errorToast } = useServerErrorToast();
  const download = useMutation({
    mutationFn: async () => {
      const response = await fetch(serializeAttestationReportSearchParams('/api/attestationresults/export', query));
      if (!response.ok) {
        throw new Error(`${response.status} Error`);
      }
      await saveAsBlob(response, 'attestation-results.csv');
    },
    onError: () => errorToast(),
  });
  return (
    <Button variant="secondary" size="small" loading={download.isPending} onClick={() => download.mutate()}>
      <Download />
      {t('export')}
    </Button>
  );
};
import { serializeAttestationReportSearchParams } from '../search-params';
