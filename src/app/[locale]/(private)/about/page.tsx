import { use } from 'react';
import { Heading1, Heading4 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/props';
import RichText from '@/components/typography/rich-text';

const INTL_NAMESPACE = 'private.about';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function AboutPage({ params }: LocaleProps) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <article className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <RichText>
          {(tags) =>
            t.rich('content', {
              ...tags,
              h4: (chunks) => <Heading4 className="mt-10">{chunks}</Heading4>,
            })
          }
        </RichText>
      </article>
    </SubLayout>
  );
}
