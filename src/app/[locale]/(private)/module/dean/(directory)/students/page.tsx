import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeanGroups, getDeanStudents } from '@/actions/dean.actions';
import { Card } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Show } from '@/components/utils/show';
import { type LocaleProps } from '@/types/locale-props';

import { loadStudentSearchParams } from '../../search-params';
import { getDeanDepartmentSelection } from '../../utils/dean-departments';
import { StudentDirectoryFilters } from './components/student-directory-filters';
import { StudentDirectoryTable } from './components/student-directory-table';

const INTL_NAMESPACE = 'private.dean';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('students'),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await loadStudentSearchParams(searchParams);
  const { departments, selected } = await getDeanDepartmentSelection(params.departmentId);
  const [groups, studentPage] = departments.length
    ? await Promise.all([
        getDeanGroups(),
        getDeanStudents({
          departmentId: selected?.id,
          course: params.course ?? undefined,
          group: params.group ?? undefined,
          page: params.page,
        }),
      ])
    : [[], null];

  const { pageSize = 1, totalCount = 0 } = studentPage ?? {};

  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <StudentDirectoryFilters departments={departments} groups={groups} />
      <StudentDirectoryTable department={selected?.name} students={studentPage?.students ?? []} />
      <Show when={totalCount > pageSize}>
        <div className="mt-4">
          <PaginationWithLinks page={params.page} pageSize={pageSize} totalCount={totalCount} />
        </div>
      </Show>
    </Card>
  );
}
