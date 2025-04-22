import { use } from 'react';
import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FrequentlyAskedQuestions } from '@/containers/faq/frequently-asked-questions';

interface Props {
  params: Promise<{ locale: string }>;
}

const SECTIONS = [
  'group-has-no-students',
  'student-missing-in-control',
  'wrong-student-group',
  'extra-disciplines-in-control',
];

const INTL_NAMESPACE = 'private.faq';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function FAQPage({ params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <FrequentlyAskedQuestions i18nNamespace={INTL_NAMESPACE} sections={SECTIONS} />
      </div>
    </SubLayout>
  );
}
