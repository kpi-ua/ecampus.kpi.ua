import { getTranslations } from 'next-intl/server';

import { Heading2, Paragraph } from '@/components/typography';

export const CriteriaDescription = async () => {
  const t = await getTranslations('private.vote.criteria');
  const CRITERIA = ['objectivity', 'clarity', 'partnership', 'respect', 'distance'] as const;

  return (
    <section className="w-full rounded-3xl bg-white p-6">
      <Heading2 className="mb-6 text-3xl leading-2xl text-neutral-900 lg:text-3xl lg:leading-2xl">
        {t('title')}
      </Heading2>
      <ol className="grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2 lg:grid-cols-3">
        {CRITERIA.map((criterion, index) => (
          <li key={criterion} className="min-w-0 rounded-2xl bg-neutral-50 px-6 py-5 wrap-break-word">
            <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-brand-200 text-lg leading-6 font-medium text-basic-blue">
              {index + 1}
            </span>
            <Paragraph className="mb-1 text-lg leading-lg font-semibold text-basic-black">
              {t(`items.${criterion}.name`)}
            </Paragraph>
            <Paragraph className="m-0 text-xs leading-xs font-medium whitespace-pre-line text-neutral-900">
              {t(`items.${criterion}.description`)}
            </Paragraph>
            <Paragraph className="mt-2 mb-0 text-xs leading-xs font-medium whitespace-pre-line text-neutral-900">
              {t(`items.${criterion}.evaluation`)}
            </Paragraph>
          </li>
        ))}
      </ol>
    </section>
  );
};
