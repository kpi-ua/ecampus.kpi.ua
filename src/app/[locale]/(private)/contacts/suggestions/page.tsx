import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SubLayout } from '../../sub-layout';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'public.suggestions';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default async function SuggestionsPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);
  const contactsT = await getTranslations('private.contacts');

  return (
    <SubLayout pageTitle={t('header')} breadcrumbs={[['/contacts', contactsT('title')]]}>
      <div className="col-span-4">
        <Heading1>{t('header')}</Heading1>
        <Paragraph>
          <iframe
            src={process.env.NEXT_PUBLIC_SUGGESTIONS_FORM!}
            width="100%"
            height="950"
            className="-mx-[5%] w-[110%]"
          ></iframe>
        </Paragraph>
      </div>
    </SubLayout>
  );
}
