'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export const DownloadPdfButton = () => {
  const t = useTranslations('private.k-reports.k-7.actions');

  return (
    <Button
      type="button"
      size="small"
      className="h-8 shrink-0 px-3 py-0 text-[12px] leading-[16px] active:px-[11px] active:py-0"
    >
      {t('downloadPdf')}
    </Button>
  );
};
