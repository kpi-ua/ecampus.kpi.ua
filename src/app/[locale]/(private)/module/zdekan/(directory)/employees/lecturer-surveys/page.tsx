import { getLocale } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeanOfficeLecturerSurveys } from '@/actions/dean-office.actions';
import { Card } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { redirect } from '@/i18n/routing';

import { DeanOfficeDepartmentFilter } from '../../../components/dean-office-department-filter';
import { getDeanOfficeDepartmentSelection } from '../../../components/dean-office-departments';
import { LecturerSurveyTable } from '../../../components/lecturer-survey-table';
import { loadSurveySearchParams, serializeSurveySearchParams } from '../../../search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId, page } = await loadSurveySearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(departmentId);
  const surveyPage = departments.length
    ? await getDeanOfficeLecturerSurveys({ departmentId: selected?.id, allAppointments: false, page })
    : null;

  if (surveyPage) {
    const lastPage = Math.max(1, Math.ceil(surveyPage.totalCount / surveyPage.pageSize));
    if (page > lastPage) {
      return redirect({
        href: serializeSurveySearchParams('/module/zdekan/employees/lecturer-surveys', {
          departmentId,
          page: lastPage,
        }),
        locale: await getLocale(),
      });
    }
  }
  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <DeanOfficeDepartmentFilter departments={departments} />
      <LecturerSurveyTable surveys={surveyPage?.surveys ?? []} />
      {surveyPage && (surveyPage.totalCount > surveyPage.pageSize || page > 1) && (
        <div className="mt-4">
          <PaginationWithLinks page={page} pageSize={surveyPage.pageSize} totalCount={surveyPage.totalCount} />
        </div>
      )}
    </Card>
  );
}
