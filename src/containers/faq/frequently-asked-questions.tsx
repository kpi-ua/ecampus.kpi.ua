import { Heading4 } from '@/components/typography/headers';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface FrequentlyAskedQuestionsProps {
  i18nNamespace: string;
  sections: string[];
}

export const FrequentlyAskedQuestions = ({ i18nNamespace, sections }: FrequentlyAskedQuestionsProps) => {
  const t = useTranslations(i18nNamespace);

  return (
    <>
      {sections.map((section) => {
        const header = t(`sections.${section}.header`);
        const content = t.rich(`sections.${section}.content`, {
          documentlink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_CAMPUS_DOCUMENT_TEMPLATE!} target="_blank">
              {chunks}
            </Link>
          ),
          curatorlink: (chunks) => <Link href="/curator-search">{chunks}</Link>,
          restorepasswordlink: (chunks) => <Link href="/password-reset">{chunks}</Link>,
        });

        return (
          <section key={section} className="my-8 text-lg leading-lg">
            <Heading4>{header}</Heading4>
            {content}
          </section>
        );
      })}
    </>
  );
};
