import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SubLayout } from '../../sub-layout';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';

const INTL_NAMESPACE = 'public.suggestions';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('header'),
  };
}

export default function SuggestionsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);
  const contactsT = useTranslations('private.contacts');

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
