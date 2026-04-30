import { getTranslations } from 'next-intl/server';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import {
  getSbpLoads,
  getSbpRights,
  getSbpRightsMe,
  getSbpStudyYears,
  getSbpSubdivisions,
} from '@/actions/sbp-rights.actions';
import { LocaleProps } from '@/types/locale-props';
import { AccessDeniedState } from './components/access-denied-state';
import { GrantButton } from './components/grant-button';
import { RightsEmptyState } from './components/rights-empty-state';
import { RightsFilters } from './components/rights-filters';
import { RightsTable } from './components/rights-table';

const INTL_NAMESPACE = 'private.studbonuspointsrights';
const PAGE_SIZE = 20;

interface PageProps extends LocaleProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const pickString = (raw: string | string[] | undefined): string | undefined =>
  Array.isArray(raw) ? raw[0] : raw;

const parsePage = (raw?: string): number => {
  const n = parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

const parseId = (raw?: string): number | undefined => {
  if (!raw) return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function SbpRightsPage({ searchParams }: PageProps) {
  const t = await getTranslations(INTL_NAMESPACE);

  // Gate the whole page on /sbp-rights/me. The endpoint is public to
  // authenticated users so we can render a friendly access-denied state
  // instead of waiting for the admin endpoints to 403 one by one.
  const me = await getSbpRightsMe();
  if (!me.isSuperAdmin) {
    return <AccessDeniedState />;
  }

  const params = await searchParams;
  const page = parsePage(pickString(params.page));
  const search = pickString(params.search);
  const studyingYearId = parseId(pickString(params.studyingYearId));
  const subdivisionId = parseId(pickString(params.subdivisionId));
  const loadId = parseId(pickString(params.loadId));

  const [rights, loads, subdivisions, years] = await Promise.all([
    getSbpRights({ page, pageSize: PAGE_SIZE, search, studyingYearId, subdivisionId, loadId }),
    getSbpLoads(),
    getSbpSubdivisions(),
    getSbpStudyYears(),
  ]);

  const hasFilters = Boolean(search || studyingYearId || subdivisionId || loadId);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Heading2>{t('title')}</Heading2>
            <Description>{t('subtitle')}</Description>
          </div>
          <GrantButton loads={loads} subdivisions={subdivisions} years={years} />
        </div>

        <RightsFilters
          loads={loads}
          subdivisions={subdivisions}
          years={years}
          initial={{ search, studyingYearId, subdivisionId, loadId }}
        />

        {rights.total === 0 ? (
          <RightsEmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <RightsTable items={rights.items} />
            <PaginationWithLinks page={page} pageSize={PAGE_SIZE} totalCount={rights.total} />
          </>
        )}
      </div>
    </SubLayout>
  );
}
