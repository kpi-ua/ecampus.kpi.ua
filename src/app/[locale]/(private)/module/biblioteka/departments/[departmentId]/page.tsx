import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getBibliotekaDepartments, getBibliotekaEmployees } from '@/actions/biblioteka.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { BibliotekaTabs } from '../../components/biblioteka-tabs';
import { EmployeesTable } from '../../components/employees-table';
import { EntityHeading } from '../../components/entity-heading';

interface Props {
  params: Promise<{ departmentId: string }>;
}

export default async function DepartmentPage({ params }: Props) {
  const { departmentId } = await params;
  const id = Number(departmentId);
  const [departments, employees, t] = await Promise.all([
    getBibliotekaDepartments(),
    getBibliotekaEmployees({ departmentId: id }),
    getTranslations('private.biblioteka'),
  ]);
  const department = departments.find((item) => item.id === id);
  if (!department) notFound();

  return (
    <SubLayout pageTitle={department.abbreviation} breadcrumbs={[['/module/biblioteka', t('departments.title')]]}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <BibliotekaTabs active="departments" />
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
