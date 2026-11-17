import { getTranslations } from 'next-intl/server';

import { getPlanLoads, getPlanWorkplaces, getCurrentPlanYear } from '@/actions/plans.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { PlansView } from './components/plans-view';

const INTL_NAMESPACE = 'private.plans';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function PlansPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const [currentYear, workplaces] = await Promise.all([getCurrentPlanYear(), getPlanWorkplaces()]);

  const loads = await getPlanLoads();

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full">
        <div className="mb-6 max-w-3xl">
          <Heading2>{t('title')}</Heading2>
          <Description>{t('subtitle')}</Description>
        </div>
        <PlansView currentYear={currentYear} workplaces={workplaces} initialLoads={loads} />
      </div>
    </SubLayout>
  );
}
