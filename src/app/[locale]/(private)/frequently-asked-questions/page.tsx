import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FrequentlyAskedQuestions } from '@/containers/faq/frequently-asked-questions';

const SECTIONS = [
  'how-to-register',
  'how-to-restore-password',
  'group-has-no-students',
  'student-missing-in-control',
  'wrong-student-group',
  'extra-disciplines-in-control',
];

const INTL_NAMESPACE = 'private.faq';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function FAQPage({ params: { locale } }: { params: { locale: string } }) {
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
