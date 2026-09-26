import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getLibraryDepartments, getLibraryEmployees } from '@/actions/library.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { LibraryTabs } from '../../components/library-tabs';
import { EmployeesTable } from '../../components/employees-table';
import { EntityHeading } from '../../components/entity-heading';

interface Props {
  params: Promise<{ departmentId: string }>;
}

export default async function DepartmentPage({ params }: Props) {
  const { departmentId } = await params;
  const id = Number(departmentId);
  const [departments, employees, t] = await Promise.all([
    getLibraryDepartments(),
    getLibraryEmployees({ departmentId: id }),
    getTranslations('private.library'),
  ]);
  const department = departments.find((item) => item.id === id);
  if (!department) notFound();

  return (
    <SubLayout pageTitle={department.abbreviation} breadcrumbs={[['/module/biblioteka', t('departments.title')]]}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <LibraryTabs active="departments" />
        <EntityHeading
          title={department.name}
          badge={department.facultyAbbreviation}
          description={t('department.description')}
        />
        <EmployeesTable employees={employees} exportLabel={department.abbreviation} departmentId={id} />
      </div>
    </SubLayout>
  );
}
