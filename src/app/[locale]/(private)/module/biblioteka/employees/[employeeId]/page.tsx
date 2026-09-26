import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import qs from 'query-string';

import { getLibraryDepartments, getLibraryEmployee } from '@/actions/library.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { LibraryTabs } from '../../components/library-tabs';
import { EmployeeDetails } from '../../components/employee-details';

interface Props {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ userAccountId?: string; departmentId?: string; letter?: string }>;
}

export default async function EmployeePage({ params, searchParams }: Props) {
  const [{ employeeId }, { userAccountId, departmentId, letter }, t] = await Promise.all([
    params,
    searchParams,
    getTranslations('private.library'),
  ]);
  const details = await getLibraryEmployee(userAccountId ? Number(userAccountId) : null, Number(employeeId));
  if (!details) notFound();
  const department = departmentId
    ? (await getLibraryDepartments()).find((item) => item.id === Number(departmentId))
    : undefined;
  const alphabetLetter = letter?.toUpperCase();
  const fromAlphabet =
    !departmentId && alphabetLetter?.length === 1 && 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'.includes(alphabetLetter);
  const breadcrumbs = fromAlphabet
    ? [
        [
          qs.stringifyUrl({ url: '/module/biblioteka/alphabet', query: { letter: alphabetLetter } }),
          `${t('tabs.alphabet')} ${alphabetLetter}`,
        ],
      ]
    : [
        ['/module/biblioteka', t('departments.title')],
        ...(department ? [[`/module/biblioteka/departments/${department.id}`, department.abbreviation]] : []),
      ];

  return (
    <SubLayout pageTitle={details.fullName} breadcrumbs={breadcrumbs}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <LibraryTabs />
        <EmployeeDetails initialDetails={details} />
      </div>
    </SubLayout>
  );
}
