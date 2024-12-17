'use client';

import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';

interface DownloadButtonProps {
  url: string;
}

export const DownloadButton = ({ url }: DownloadButtonProps) => {
  const t = useTranslations('global.misc');

  return <Button onClick={() => saveAs(url)}>{t('download')}</Button>;
};
