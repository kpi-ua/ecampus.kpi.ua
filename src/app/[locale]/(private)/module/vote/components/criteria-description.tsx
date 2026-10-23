import { getTranslations } from 'next-intl/server';

import { Heading2, Paragraph } from '@/components/typography';

export const CriteriaDescription = async () => {
  const t = await getTranslations('private.vote.criteria');
  const CRITERIA = ['objectivity', 'clarity', 'partnership', 'respect', 'distance'] as const;

  return (
    <section className="w-full rounded-3xl bg-white p-6">
      <Heading2 className="leading-2xl lg:leading-2xl mb-6 text-3xl text-neutral-900 lg:text-3xl">
        {t('title')}
      </Heading2>
      <ol className="grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2 lg:grid-cols-3">
        {CRITERIA.map((criterion, index) => (
          <li key={criterion} className="min-w-0 rounded-2xl bg-neutral-50 px-6 py-5 wrap-break-word">
            <span className="text-basic-blue bg-brand-200 mb-3 flex size-11 items-center justify-center rounded-full text-lg leading-6 font-medium">
              {index + 1}
            </span>
            <Paragraph className="text-basic-black leading-lg mb-1 text-lg font-semibold">
              {t(`items.${criterion}.name`)}
            </Paragraph>
            <Paragraph className="leading-xs m-0 text-xs font-medium whitespace-pre-line text-neutral-900">
              {t(`items.${criterion}.description`)}
            </Paragraph>
            <Paragraph className="leading-xs mt-2 mb-0 text-xs font-medium whitespace-pre-line text-neutral-900">
              {t(`items.${criterion}.evaluation`)}
            </Paragraph>
          </li>
        ))}
      </ol>
    </section>
  );
};
