import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { Card } from '@/components/ui/card';
import { type LocaleProps } from '@/types/locale-props';

import { DeanOfficeDepartmentFilter } from '../../components/dean-office-department-filter';
import { loadEmployeeSearchParams } from '../../search-params';
import { getDeanOfficeDepartmentSelection } from '../../utils/dean-office-departments';
import { EmployeeDirectoryTab } from './components/employee-directory-tab';
import { EmployeeSourceFilter } from './components/employee-source-filter';

const INTL_NAMESPACE = 'private.dean-office';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('employees'),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId, view } = await loadEmployeeSearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(departmentId);

  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <div className="grid max-w-3xl gap-x-4 sm:grid-cols-2">
        <DeanOfficeDepartmentFilter departments={departments} />
        <EmployeeSourceFilter hasSelectedDepartment={!!selected} />
      </div>
      <EmployeeDirectoryTab selected={selected} hasDepartments={departments.length > 0} view={view} />
    </Card>
  );
}
