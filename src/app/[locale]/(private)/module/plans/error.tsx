'use client';

import { useTranslations } from 'next-intl';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations('private.plans');
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex flex-col items-start gap-4">
        <Heading2>{t('requestError')}</Heading2>
        <Paragraph className="my-0">{t('errorHint')}</Paragraph>
        <Button onClick={reset}>{t('retry')}</Button>
      </div>
    </SubLayout>
  );
}
