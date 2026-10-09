import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import qs from 'query-string';

import { getLibraryDepartments, getLibraryEmployee } from '@/actions/library.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { UKRAINIAN_ALPHABET } from '@/lib/constants/alphabet';
import { userHasModule } from '@/lib/jwt';

import { LibraryTabs } from '../../components/library-tabs';
import { EmployeeDetails } from '../../components/employee-details';
import { LIBRARY_EDIT_MODULE } from '../../constants';

const INTL_NAMESPACE = 'private.library';

interface Props {
  params: Promise<{ locale: string; employeeId: string }>;
  searchParams: Promise<{ userAccountId?: string; departmentId?: string; letter?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('title') };
}

export default async function EmployeePage({ params, searchParams }: Props) {
  const canEdit = await userHasModule(LIBRARY_EDIT_MODULE);
  const [{ employeeId }, { userAccountId, departmentId, letter }, t] = await Promise.all([
    params,
    searchParams,
    getTranslations(INTL_NAMESPACE),
  ]);
  const id = Number(employeeId);
  const accountId = userAccountId ? Number(userAccountId) : null;
  if (!Number.isInteger(id) || id < 1 || (accountId !== null && (!Number.isInteger(accountId) || accountId < 1))) {
    notFound();
  }

  const details = await getLibraryEmployee(accountId, id);
  if (!details) notFound();
  const department = departmentId
    ? (await getLibraryDepartments()).find((item) => item.id === Number(departmentId))
    : undefined;
  const alphabetLetter = letter?.toUpperCase();
  const fromAlphabet = !departmentId && alphabetLetter?.length === 1 && UKRAINIAN_ALPHABET.includes(alphabetLetter);
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
        <EmployeeDetails initialDetails={details} canEdit={canEdit} />
      </div>
    </SubLayout>
  );
}
