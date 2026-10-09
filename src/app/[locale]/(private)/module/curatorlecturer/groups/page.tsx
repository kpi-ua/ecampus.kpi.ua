import { getTranslations } from 'next-intl/server';
import { getCuratorFilters, getCuratorGroups } from '@/actions/curatorlecturer.actions';
import { GroupCuratorView } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/group-curator-view';
import { LocaleProps } from '@/types/locale-props';
import { LecturerCuratorView } from '../components/lecturer-curator-view';

const INTL_NAMESPACE = 'private.curatorlecturer';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function CuratorGroupsPage() {
  const [groups, filters] = await Promise.all([getCuratorGroups(), getCuratorFilters()]);
  return (
    <LecturerCuratorView activeTab="groups">
      <GroupCuratorView groups={groups} filters={filters} />
    </LecturerCuratorView>
  );
}
