'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface Props {
  k7ReportRequestId: string;
}

export const DownloadPdfButton = ({ k7ReportRequestId }: Props) => {
  const t = useTranslations('private.k-reports.k-7.actions');

  const handleDownload = () => {
    console.log('K-7 PDF download endpoint is not available yet.', { k7ReportRequestId });
  };

  return (
    <Button
      type="button"
      size="small"
      className="h-8 shrink-0 px-3 py-0 text-[12px] leading-[16px] active:px-[11px] active:py-0"
      onClick={handleDownload}
    >
      {t('downloadPdf')}
    </Button>
  );
};
