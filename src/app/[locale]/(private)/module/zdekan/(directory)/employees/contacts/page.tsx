import { type SearchParams } from 'nuqs/server';

import { getDeanOfficeContacts } from '@/actions/dean-office.actions';
import { Card } from '@/components/ui/card';

import { DeanOfficeDepartmentFilter } from '../../../components/dean-office-department-filter';
import { getDeanOfficeDepartmentSelection } from '../../../components/dean-office-departments';
import { EmployeeContactsTable } from '../../../components/employee-contacts-table';
import { loadDepartmentSearchParams } from '../../../search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId } = await loadDepartmentSearchParams(searchParams);
  const { departments, selected } = await getDeanOfficeDepartmentSelection(departmentId);
  const contacts = departments.length ? await getDeanOfficeContacts(selected?.id) : null;

  return (
    <div className="grid min-w-0 gap-6">
      <Card className="min-w-0 rounded-t-none p-6">
        <DeanOfficeDepartmentFilter departments={departments} />
        <div className="grid min-w-0 gap-6">
          <EmployeeContactsTable title="teachingStaffContacts" employees={contacts?.teachingStaff ?? []} />
          {!!contacts?.otherStaff.length && (
            <EmployeeContactsTable title="otherStaffContacts" employees={contacts.otherStaff} />
          )}
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
