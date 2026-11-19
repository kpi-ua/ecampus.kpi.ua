import { notFound } from 'next/navigation';

import { getDeanOfficeDepartments } from '@/actions/dean-office.actions';

export async function getDeanOfficeDepartmentSelection(departmentId: number | null) {
  const departments = await getDeanOfficeDepartments();
  const selected = departments.find(({ id }) => id === departmentId);
  if (departmentId !== null && !selected) {
    notFound();
  }
  return { departments, selected };
}
