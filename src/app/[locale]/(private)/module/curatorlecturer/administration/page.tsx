import { getTranslations } from 'next-intl/server';
import { getCuratorAdminGroups, getCuratorAdminFilters, getCuratorLecturers } from '@/actions/curatorlecturer.actions';
import { CuratorAdministrationView } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/curator-administration-view';
import { LocaleProps } from '@/types/locale-props';
import { LecturerCuratorView } from '../components/lecturer-curator-view';

const INTL_NAMESPACE = 'private.curatorlecturer.group-curator.administration';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function CuratorAdministrationPage() {
  const filters = await getCuratorAdminFilters();
  const departments = filters?.departments ?? [];
  const currentYear = filters?.currentYear;
  const [groups, lecturers] =
    departments.length && currentYear
      ? await Promise.all([getCuratorAdminGroups(currentYear.id), getCuratorLecturers()])
      : [[], []];

  return (
    <LecturerCuratorView activeTab="administration">
      <CuratorAdministrationView
        initialGroups={groups}
        initialLecturers={lecturers}
        departments={departments}
        currentYear={currentYear ?? null}
      />
    </LecturerCuratorView>
  );
}
