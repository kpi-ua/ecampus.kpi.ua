import { getTranslations } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { AnnouncementManagement } from './components/announcement-management';
import {
  AdminAnnouncementsLanguage,
  AdminAnnouncementsSort,
  getAdminAnnouncements,
  getAllGroups,
  getCourses,
  getRoles,
  getStudyForms,
} from '@/actions/announcement.actions';

const INTL_NAMESPACE = 'private.announcementseditor';

const PAGE_SIZE = 20;
const VALID_LANGUAGES: AdminAnnouncementsLanguage[] = ['all', 'uk', 'en'];
const VALID_SORTS: AdminAnnouncementsSort[] = ['EndDesc', 'EndAsc', 'StartDesc', 'StartAsc', 'TitleAsc'];

const pickString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const parsePage = (raw: string | undefined): number => {
  const n = parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

const parseLanguage = (raw: string | undefined): AdminAnnouncementsLanguage => {
  const lower = raw?.toLowerCase();
  return VALID_LANGUAGES.find((v) => v === lower) ?? 'all';
};

const parseSort = (raw: string | undefined): AdminAnnouncementsSort => {
  return VALID_SORTS.find((v) => v === raw) ?? 'EndDesc';
};

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('title'),
  };
}

interface PageProps extends LocaleProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const t = await getTranslations(INTL_NAMESPACE);

  const params = await searchParams;
  const page = parsePage(pickString(params.page));
  const search = pickString(params.search);
  const language = parseLanguage(pickString(params.language));
  const sort = parseSort(pickString(params.sort));

  const [adminData, rolesData, studyFormsData, groupsData, coursesData] = await Promise.all([
    getAdminAnnouncements({ page, pageSize: PAGE_SIZE, search, language, sort }),
    getRoles(),
    getStudyForms(),
    getAllGroups(),
    getCourses(),
  ]);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>

        <AnnouncementManagement
          items={adminData.items}
          total={adminData.total}
          page={page}
          pageSize={PAGE_SIZE}
          rolesData={rolesData}
          studyFormsData={studyFormsData}
          groupsData={groupsData}
          coursesData={coursesData}
        />
      </div>
    </SubLayout>
  );
}
