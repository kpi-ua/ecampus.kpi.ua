import { getTranslations } from 'next-intl/server';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { getSbpLoads, getSbpStudyYears, getSbpSubdivisions } from '@/actions/sbp-rights.actions';
import { LocaleProps } from '@/types/locale-props';
import { GrantForm } from '../components/grant-form';
import { SBP_RIGHTS_PATH } from '../constants';

const INTL_NAMESPACE = 'private.studbonuspointsrights.grant';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function GrantSbpRightsPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const tParent = await getTranslations('private.studbonuspointsrights');

  const [loads, subdivisions, years] = await Promise.all([getSbpLoads(), getSbpSubdivisions(), getSbpStudyYears()]);

  const breadcrumbs: string[][] = [[SBP_RIGHTS_PATH, tParent('title')]];

  return (
    <SubLayout pageTitle={t('title')} breadcrumbs={breadcrumbs}>
      <div className="col-span-12 space-y-6">
        <div>
          <Heading2>{t('title')}</Heading2>
          <Description>{t('description')}</Description>
        </div>
        <GrantForm loads={loads} subdivisions={subdivisions} years={years} />
      </div>
    </SubLayout>
  );
}
