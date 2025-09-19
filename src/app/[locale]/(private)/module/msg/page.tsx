import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import React from 'react';
import MessagePageContent from '@/app/[locale]/(private)/module/msg/page-content';
import { Heading2, Paragraph } from '@/components/typography';

const INTL_NAMESPACE = 'private.msg';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function MessagePage() {
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-7">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="leading-sm mt-3 mb-7 max-w-full text-sm font-normal text-neutral-700 sm:max-w-2xl">
          {t('subtitle')}
        </Paragraph>
        {/*<ModuleHeader creditModule={creditModule} studyPeriod={studyPeriod} />*/}
        <MessagePageContent />
      </div>
    </SubLayout>
  );
}
