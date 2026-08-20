'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { downloadK7Report } from '../../utils/download-k7-report';

interface Props {
  requestId: string;
  year: number;
}

export const DownloadPdfButton = ({ requestId, year }: Props) => {
  const t = useTranslations('private.k-7.actions');
  const { errorToast } = useServerErrorToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      await downloadK7Report({ requestId, year });
    } catch {
      errorToast();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      size="small"
      className="leading-xs h-8 w-[136px] shrink-0 px-3 py-0 text-xs active:px-[11px] active:py-0"
      loading={isDownloading}
      onClick={handleDownload}
    >
      {t('downloadPdf')}
    </Button>
  );
};
