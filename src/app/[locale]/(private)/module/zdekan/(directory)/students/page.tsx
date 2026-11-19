import { getLocale } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeanOfficeGroups, getDeanOfficeStudents } from '@/actions/dean-office.actions';
import { Card } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { redirect } from '@/i18n/routing';

import { getDeanOfficeDepartmentSelection } from '../../components/dean-office-departments';
import { StudentDirectoryFilters } from '../../components/student-directory-filters';
import { StudentDirectoryTable } from '../../components/student-directory-table';
import { loadStudentSearchParams, serializeStudentSearchParams } from '../../search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId, course, group, page } = await loadStudentSearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(departmentId);
  const [groups, studentPage] = departments.length
    ? await Promise.all([
        getDeanOfficeGroups(),
        getDeanOfficeStudents({
          departmentId: selected?.id,
          course: course ?? undefined,
          group: group ?? undefined,
          page,
        }),
      ])
    : [[], null];

  if (studentPage) {
    const lastPage = Math.max(1, Math.ceil(studentPage.totalCount / studentPage.pageSize));
    if (page > lastPage) {
      return redirect({
        href: serializeStudentSearchParams('/module/zdekan/students', { departmentId, course, group, page: lastPage }),
        locale: await getLocale(),
      });
    }
  }
  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <StudentDirectoryFilters departments={departments} groups={groups} />
      <StudentDirectoryTable department={selected?.name} students={studentPage?.students ?? []} />
      {studentPage && (studentPage.totalCount > studentPage.pageSize || page > 1) && (
        <div className="mt-4">
          <PaginationWithLinks page={page} pageSize={studentPage.pageSize} totalCount={studentPage.totalCount} />
        </div>
      )}
    </Card>
  );
}
