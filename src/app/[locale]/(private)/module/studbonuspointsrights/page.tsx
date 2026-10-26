import { getTranslations } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { getSbpLoads, getSbpRights, getSbpStudyYears, getSbpSubdivisions } from '@/actions/sbp-rights.actions';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';
import { redirect } from '@/i18n/routing';
import { hasModule } from '@/lib/jwt';
import { LocaleProps } from '@/types/locale-props';
import { AccessDeniedState } from './components/access-denied-state';
import { GrantButton } from './components/grant-button';
import { RightsEmptyState } from './components/rights-empty-state';
import { RightsFilters } from './components/rights-filters';
import { RightsTable } from './components/rights-table';
import { SBP_RIGHTS_MODULE, SBP_RIGHTS_PATH } from './constants';
import { loadRightsSearchParams, serializeRightsSearchParams } from './search-params';

const INTL_NAMESPACE = 'private.studbonuspointsrights';

interface PageProps extends LocaleProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function SbpRightsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations(INTL_NAMESPACE);

  if (!(await hasModule(SBP_RIGHTS_MODULE))) {
    return <AccessDeniedState />;
  }

  const filters = await loadRightsSearchParams(searchParams);

  const [rights, loads, subdivisions, years] = await Promise.all([
    getSbpRights({ ...filters, pageSize: PAGE_SIZE_DEFAULT }),
    getSbpLoads(),
    getSbpSubdivisions(),
    getSbpStudyYears(),
  ]);

  // Revoking the last rows of the last page leaves the URL past the end; go to the new last page.
  const lastPage = Math.max(1, Math.ceil(rights.total / PAGE_SIZE_DEFAULT));
  if (rights.items.length === 0 && filters.page > lastPage) {
    redirect({ href: serializeRightsSearchParams(SBP_RIGHTS_PATH, { ...filters, page: lastPage }), locale });
  }

  const hasFilters = Boolean(filters.search || filters.studyingYearId || filters.subdivisionId || filters.loadId);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <Heading2>{t('title')}</Heading2>
            <Description>{t('subtitle')}</Description>
          </div>
          <GrantButton />
        </div>

        <RightsFilters loads={loads} subdivisions={subdivisions} years={years} />

        <div className="mt-8">
          {rights.items.length === 0 ? (
            <RightsEmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <RightsTable items={rights.items} />
              <div className="mt-4">
                <PaginationWithLinks page={filters.page} pageSize={PAGE_SIZE_DEFAULT} totalCount={rights.total} />
              </div>
            </>
          )}
        </div>
      </div>
    </SubLayout>
  );
}
