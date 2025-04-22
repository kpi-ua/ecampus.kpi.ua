import { use } from 'react';
import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/props';
import RichText from '@/components/typography/rich-text';

const INTL_NAMESPACE = 'private.terms-of-service';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function TermsOfServicePage({ params }: LocaleProps) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <article className="col-span-6">
        <Heading1>{t('header')}</Heading1>
        <RichText>{(tags) => t.rich('content', tags)}</RichText>
      </article>
    </SubLayout>
  );
}
