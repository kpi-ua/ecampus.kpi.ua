import { getDeanOfficeEmployees, getDeanOfficePersonnel } from '@/actions/dean-office.actions';

import { EmployeeDirectoryTable } from './employee-directory-table';
import { EmployeePersonnelTable } from './employee-personnel-table';

export async function EmployeeDirectoryTab({
  view,
  selected,
  hasDepartments,
}: {
  view: 'campus' | 'personnel';
  selected?: { id: number; name: string };
  hasDepartments: boolean;
}) {
  if (view === 'personnel' && selected) {
    return <EmployeePersonnelTable personnel={await getDeanOfficePersonnel(selected.id)} />;
  }

  const employees = hasDepartments ? await getDeanOfficeEmployees(selected?.id) : [];
  return <EmployeeDirectoryTable employees={employees} department={selected?.name} />;
}
