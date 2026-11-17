'use client';

import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { AttestationReportQuery } from '../types';
import { exportAttestationResults } from '../utils/export-attestation-results';

interface Props {
  query: AttestationReportQuery;
}

export const ReportExportButton = ({ query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const { errorToast } = useServerErrorToast();
  const download = useMutation({
    mutationFn: exportAttestationResults,
    onError: () => errorToast(),
  });
  return (
    <Button variant="secondary" size="small" loading={download.isPending} onClick={() => download.mutate(query)}>
      <Download />
      {t('export')}
    </Button>
  );
};
