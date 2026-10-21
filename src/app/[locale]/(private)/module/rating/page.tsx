import { getTranslations } from 'next-intl/server';

import { getRatingData } from '@/actions/rating.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { RatingView } from './components/rating-view';

const INTL_NAMESPACE = 'private.rating';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function RatingPage() {
  const ratingData = await getRatingData();
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full px-2 sm:px-4 md:px-0">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="mt-3 mb-7 max-w-full text-sm leading-sm font-normal text-neutral-700 sm:max-w-2xl">
          {t('subtitle')}
        </Paragraph>
        <RatingView ratingData={ratingData} />
      </div>
    </SubLayout>
  );
}
