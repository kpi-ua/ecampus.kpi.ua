import { getTranslations } from 'next-intl/server';
import {
  getCuratorAdminGroups,
  getCuratorDepartments,
  getCuratorFilters,
  getCuratorLecturers,
} from '@/actions/curatorlecturer.actions';
import { CuratorAdministrationView } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/curator-administration-view';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.curatorlecturer.group-curator.administration';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function CuratorAdministrationPage() {
  const departments = await getCuratorDepartments();
  const filters = departments.length ? await getCuratorFilters() : null;
  const yearId = filters?.years[0]?.id;
  const [groups, lecturers] = departments.length && yearId
    ? await Promise.all([getCuratorAdminGroups(yearId), getCuratorLecturers()])
    : [[], []];

  return (
    <CuratorAdministrationView
      initialGroups={groups}
      initialLecturers={lecturers}
      departments={departments}
      yearId={yearId}
    />
  );
}
