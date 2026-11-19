import { type SearchParams } from 'nuqs/server';

import { getDeanOfficeDirectory, getDeanOfficeResponsibilities } from '@/actions/dean-office.actions';
import { Card } from '@/components/ui/card';

import { DeanOfficeDepartmentFilter } from '../../components/dean-office-department-filter';
import { getDeanOfficeDepartmentSelection } from '../../components/dean-office-departments';
import { ResponsibilitiesTable } from '../../components/responsibilities-table';
import { loadDepartmentSearchParams } from '../../search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId } = await loadDepartmentSearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(departmentId);
  const responsibilities = selected
    ? (await getDeanOfficeDirectory(selected.id)).responsibilities
    : await getDeanOfficeResponsibilities();

  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <DeanOfficeDepartmentFilter departments={departments} />
      <ResponsibilitiesTable responsibilities={responsibilities} />
    </Card>
  );
}
