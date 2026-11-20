import { getDeanEmployees, getDeanPersonnel } from '@/actions/dean.actions';

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
    return <EmployeePersonnelTable personnel={await getDeanPersonnel(selected.id)} />;
  }

  const employees = hasDepartments ? await getDeanEmployees(selected?.id) : [];
  return <EmployeeDirectoryTable employees={employees} department={selected?.name} />;
}
