import { Heading1, Heading4 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import RichText from '@/components/typography/rich-text';

const INTL_NAMESPACE = 'private.about';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function AboutPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

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
