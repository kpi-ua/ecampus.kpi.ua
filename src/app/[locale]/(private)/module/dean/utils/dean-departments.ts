import { notFound } from 'next/navigation';

import { getDeanDepartments } from '@/actions/dean.actions';

export async function getDeanDepartmentSelection(departmentId: number | null) {
  const departments = await getDeanDepartments();
  const selected = departments.find(({ id }) => id === departmentId);
  if (departmentId !== null && !selected) {
    notFound();
  }
  return { departments, selected };
}
