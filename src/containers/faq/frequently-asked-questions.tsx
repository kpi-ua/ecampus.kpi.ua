import { Heading4 } from '@/components/typography/headers';
import RichText from '@/components/typography/rich-text';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

interface FrequentlyAskedQuestionsProps {
  i18nNamespace: string;
  sections: string[];
}

export const FrequentlyAskedQuestions = async ({ i18nNamespace, sections }: FrequentlyAskedQuestionsProps) => {
  const t = await getTranslations(i18nNamespace);

  return (
    <>
      {sections.map((section) => {
        const header = t(`sections.${section}.header`);
        const content = (
          <RichText>
            {(tags) =>
              t.rich(`sections.${section}.content`, {
                ...tags,
                documentlink: (chunks) => (
                  <Link href={process.env.NEXT_PUBLIC_CAMPUS_DOCUMENT_TEMPLATE!} target="_blank">
                    {chunks}
                  </Link>
                ),
                curatorlink: (chunks) => <Link href="/curator-search">{chunks}</Link>,
                restorepasswordlink: (chunks) => <Link href="/password-reset">{chunks}</Link>,
              })
            }
          </RichText>
        );

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
