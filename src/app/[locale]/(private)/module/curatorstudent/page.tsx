import { getTranslations } from 'next-intl/server';

import { getCurator } from '@/actions/curatorstudent.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { LocaleProps } from '@/types/locale-props';

import { StudentCuratorView } from './components/student-curator-view';

const INTL_NAMESPACE = 'private.curatorstudent';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function CuratorStudentPage() {
  const [t, curator] = await Promise.all([getTranslations(INTL_NAMESPACE), getCurator()]);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8 w-full px-2 sm:px-4 md:px-0">
        <Heading2>{t('title')}</Heading2>
        <StudentCuratorView curator={curator} />
      </div>
    </SubLayout>
  );
}
