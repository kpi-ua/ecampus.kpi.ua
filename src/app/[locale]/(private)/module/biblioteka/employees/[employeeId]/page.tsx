import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getBibliotekaDepartments, getBibliotekaEmployee } from '@/actions/biblioteka.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { BibliotekaTabs } from '../../components/biblioteka-tabs';
import { EmployeeDetails } from '../../components/employee-details';

interface Props {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ userAccountId?: string; departmentId?: string }>;
}

export default async function EmployeePage({ params, searchParams }: Props) {
  const [{ employeeId }, { userAccountId, departmentId }, t] = await Promise.all([
    params,
    searchParams,
    getTranslations('private.biblioteka'),
  ]);
  const details = await getBibliotekaEmployee(userAccountId ? Number(userAccountId) : null, Number(employeeId));
  if (!details) notFound();
  const department = departmentId
    ? (await getBibliotekaDepartments()).find((item) => item.id === Number(departmentId))
    : undefined;
  const breadcrumbs = [
    ['/module/biblioteka', t('departments.title')],
    ...(department ? [[`/module/biblioteka/departments/${department.id}`, department.abbreviation]] : []),
  ];

  return (
    <SubLayout pageTitle={details.fullName} breadcrumbs={breadcrumbs}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <BibliotekaTabs />
        <EmployeeDetails initialDetails={details} />
      </div>
    </SubLayout>
  );
}
