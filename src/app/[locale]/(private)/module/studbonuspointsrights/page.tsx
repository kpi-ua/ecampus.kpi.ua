import { getTranslations } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { getSbpLoads, getSbpRightsHolders, getSbpSubdivisions } from '@/actions/sbp-rights.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from '@/i18n/routing';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';
import { LocaleProps } from '@/types/locale-props';

import { GrantButton } from './components/grant-button';
import { ModuleTabs } from './components/module-tabs';
import { PeriodsManagement } from './components/periods/periods-management';
import { RightsEmptyState } from './components/rights-empty-state';
import { RightsFilters } from './components/rights-filters';
import { RightsTable } from './components/rights-table';
import { SBP_RIGHTS_PATH } from './constants';
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

  const filters = await loadRightsSearchParams(searchParams);

  const [holders, loads, subdivisions] = await Promise.all([
    getSbpRightsHolders({ ...filters, pageSize: PAGE_SIZE_DEFAULT }),
    getSbpLoads(),
    getSbpSubdivisions(),
  ]);

  // Revoking the last rights of the last page leaves the URL past the end; go to the new last page.
  const lastPage = Math.max(1, Math.ceil(holders.total / PAGE_SIZE_DEFAULT));
  if (holders.items.length === 0 && filters.page > lastPage) {
    redirect({ href: serializeRightsSearchParams(SBP_RIGHTS_PATH, { ...filters, page: lastPage }), locale });
  }

  const hasFilters = Boolean(filters.search || filters.subdivisionId || filters.loadId);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <div className="mb-6 max-w-2xl">
          <Heading2>{t('title')}</Heading2>
          <Description>{t('subtitle')}</Description>
        </div>

        <ModuleTabs>
          <TabsList size="small" className="self-start">
            <TabsTrigger value="rights">{t('tabs.rights')}</TabsTrigger>
            <TabsTrigger value="periods">{t('tabs.periods')}</TabsTrigger>
          </TabsList>
          <TabsContent value="rights" className="mt-0">
            <div className="mb-4 flex justify-end">
              <GrantButton />
            </div>

            <RightsFilters loads={loads} subdivisions={subdivisions} />

            <div className="mt-8">
              {holders.items.length === 0 ? (
                <RightsEmptyState hasFilters={hasFilters} />
              ) : (
                <>
                  <RightsTable holders={holders.items} />
                  <div className="mt-4">
                    <PaginationWithLinks page={filters.page} pageSize={PAGE_SIZE_DEFAULT} totalCount={holders.total} />
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="periods" className="mt-0">
            <PeriodsManagement />
          </TabsContent>
        </ModuleTabs>
      </div>
    </SubLayout>
  );
}
