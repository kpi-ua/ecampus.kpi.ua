'use client';

import { useTranslations } from 'next-intl';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';

interface Props {
  retry: () => void;
}

export default function Error({ retry }: Props) {
  const t = useTranslations('private.yiystat');
  const error = useTranslations('global.server-error');

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex flex-col items-start gap-4">
        <Heading2>{error('title')}</Heading2>
        <Paragraph className="my-0">{error('description')}</Paragraph>
        <Button onClick={retry}>{t('retry')}</Button>
      </div>
    </SubLayout>
  );
}
