import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Heading2 } from '@/components/typography/headers';
import RichText from '@/components/typography/rich-text';
import { LocaleProps } from '@/types/locale-props';

import { SubLayout } from '../sub-layout';

const INTL_NAMESPACE = 'private.terms-of-service';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function TermsOfServicePage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <article className="col-span-6">
        <Heading2>{t('header')}</Heading2>
        <RichText>{(tags) => t.rich('content', tags)}</RichText>
      </article>
    </SubLayout>
  );
}
