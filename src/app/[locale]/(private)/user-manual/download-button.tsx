'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';

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
