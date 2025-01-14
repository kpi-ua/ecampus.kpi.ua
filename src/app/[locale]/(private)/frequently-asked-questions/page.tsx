import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

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
        <Accordion type="multiple" className="mt-8">
          {SECTIONS.map((section) => {
            const header = t(`sections.${section}.header`);
            const content = t.rich(`sections.${section}.content`, {
              b: (chunks) => <span className="font-semibold">{chunks}</span>,
              documentlink: (chunks) => (
                <Link href={process.env.NEXT_PUBLIC_CAMPUS_DOCUMENT_TEMPLATE!} target="_blank">
                  {chunks}
                </Link>
              ),
              curatorlink: (chunks) => (
                <Link href={process.env.NEXT_PUBLIC_CAMPUS_FIND_CURATOR!} target="_blank">
                  {chunks}
                </Link>
              ),
              restorepasswordlink: (chunks) => (
                <Link href={process.env.NEXT_PUBLIC_CAMPUS_RESTORE_PASSWORD!} target="_blank">
                  {chunks}
                </Link>
              ),
            });
            return (
              <AccordionItem value={section} key={section} className="mb-4">
                <AccordionTrigger className="text-lg font-bold">{header}</AccordionTrigger>
                <AccordionContent className="ml-12 text-base">{content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </SubLayout>
  );
}
