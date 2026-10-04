import { getTranslations } from 'next-intl/server';
import { getCuratorTeachingGroups } from '@/actions/curatorlecturer.actions';
import { LocaleProps } from '@/types/locale-props';
import { StudyGroupsTable } from '@/app/[locale]/(private)/module/curatorlecturer/components/study-groups-table';

const INTL_NAMESPACE = 'private.curatorlecturer';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function CuratorLecturerPage() {
  const groups = await getCuratorTeachingGroups();
  return <StudyGroupsTable groups={groups} />;
}
