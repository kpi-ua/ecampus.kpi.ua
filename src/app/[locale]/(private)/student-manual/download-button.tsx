'use client';

import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  url: string;
  className?: string;
}

export const DownloadButton = ({ url, className }: DownloadButtonProps) => {
  const t = useTranslations('global.misc');

  return (
    <Button className={cn(className)} onClick={() => saveAs(url)}>
      {t('download')}
    </Button>
  );
};
