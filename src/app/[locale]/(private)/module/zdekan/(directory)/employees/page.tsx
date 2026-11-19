import { type SearchParams } from 'nuqs/server';

import { Card } from '@/components/ui/card';

import { DeanOfficeDepartmentFilter } from '../../components/dean-office-department-filter';
import { getDeanOfficeDepartmentSelection } from '../../components/dean-office-departments';
import { EmployeeDirectoryTab } from '../../components/employee-directory-tab';
import { EmployeeSourceFilter } from '../../components/employee-source-filter';
import { loadEmployeeSearchParams } from '../../search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId, view } = await loadEmployeeSearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(departmentId);

  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <div className="grid max-w-3xl gap-x-4 sm:grid-cols-2">
        <DeanOfficeDepartmentFilter departments={departments} />
        <EmployeeSourceFilter hasSelectedDepartment={!!selected} />
      </div>
      <EmployeeDirectoryTab selected={selected} hasDepartments={departments.length > 0} view={view} />
    </Card>
  );
}
