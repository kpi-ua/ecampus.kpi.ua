import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeanContacts } from '@/actions/dean.actions';
import { Card } from '@/components/ui/card';
import { Show } from '@/components/utils/show';
import { type LocaleProps } from '@/types/locale-props';

import { DeanDepartmentFilter } from '../../../components/dean-department-filter';
import { loadDepartmentSearchParams } from '../../../search-params';
import { getDeanDepartmentSelection } from '../../../utils/dean-departments';
import { EmployeeContactsTable } from './components/employee-contacts-table';

const INTL_NAMESPACE = 'private.dean';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('contacts'),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId } = await loadDepartmentSearchParams(searchParams);
  const { departments, selected } = await getDeanDepartmentSelection(departmentId);
  const contacts = departments.length ? await getDeanContacts(selected?.id) : null;
  const otherStaff = contacts?.otherStaff ?? [];

  return (
    <div className="grid min-w-0 gap-6">
      <Card className="min-w-0 rounded-t-none p-6">
        <DeanDepartmentFilter departments={departments} />
        <div className="grid min-w-0 gap-6">
          <EmployeeContactsTable title="teachingStaffContacts" employees={contacts?.teachingStaff ?? []} />
          <Show when={otherStaff.length > 0}>
            <EmployeeContactsTable title="otherStaffContacts" employees={otherStaff} />
          </Show>
        </div>
      </Card>
      <Card className="min-w-0 p-6">
        <EmployeeContactsTable title="researchStaffContacts" employees={contacts?.researchStaff ?? []} />
      </Card>
      <Card className="min-w-0 p-6">
        <EmployeeContactsTable title="supportStaffContacts" employees={contacts?.supportStaff ?? []} />
      </Card>
    </div>
  );
}
