import { Heading1, Heading4 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import dayjs from 'dayjs';

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
              documentlink: (chunks) => (
                <Link href="https://document.kpi.ua/2024_RP-294" target="_blank">
                  {chunks}
                </Link>
              ),
              curatorlnik: (chunks) => (
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
                <AccordionTrigger className="font-bold text-lg">{header}</AccordionTrigger>
                <AccordionContent className="ml-12 text-base">{content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Footer */}
      <footer className="mt-8">
        {t.rich('footer', {
          kbislink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
              {chunks}
            </Link>
          ),
          year: dayjs().year(),
        })}
      </footer>

      {/* Retry Message */}
      <p className="text-neutral-600 mt-4">
        {t.rich('retryMessage', {
          link: (chunks) => (
            <Link href={{ pathname: '/password-reset', query: { username: 'example' } }}>
              {chunks}
            </Link>
          ),
        })}
      </p>
    </SubLayout>
  );
}