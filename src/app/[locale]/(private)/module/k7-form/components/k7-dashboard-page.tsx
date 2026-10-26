import { getTranslations } from 'next-intl/server';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Paragraph } from '@/components/typography';
import { K7FormFilters, K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { K7DashboardView } from '../constants';
import { K7ReportView } from './k7-report-view';

interface Props {
  activeView: K7DashboardView;
  filters: K7FormFilters;
  initialReports: K7ReportRequest[];
  departmentProfiles?: K7FormLecturerProfileOption[];
  departmentNames: Record<number, string>;
  hasDepartmentProfiles: boolean;
  all: boolean;
}

export const K7DashboardPage = async ({
  activeView,
  filters,
  initialReports,
  departmentProfiles = [],
  departmentNames,
  hasDepartmentProfiles,
  all,
}: Props) => {
  const t = await getTranslations('private.k-7');

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex w-full min-w-0 flex-col gap-4">
        <div>
          <Heading2>{t('title')}</Heading2>
          <Paragraph className="leading-sm mt-3 mb-7 max-w-full text-sm font-normal text-neutral-700 sm:max-w-2xl">
            {t('subtitle')}
          </Paragraph>
        </div>

        <K7ReportView
          activeView={activeView}
          filters={filters}
          initialReports={initialReports}
          departmentProfiles={departmentProfiles}
          departmentNames={departmentNames}
          hasDepartmentProfiles={hasDepartmentProfiles}
          all={all}
        />
      </div>
    </SubLayout>
  );
};
