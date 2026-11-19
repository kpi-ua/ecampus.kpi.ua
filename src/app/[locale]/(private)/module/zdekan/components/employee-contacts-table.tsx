import { getTranslations } from 'next-intl/server';

import { type DeanOfficeContactDirectory } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const staffColumns = ['name', 'workplace', 'position', 'status', 'contract'] as const;
const columns = [...staffColumns, 'contactType', 'contactValue'] as const;
type Title = 'teachingStaffContacts' | 'otherStaffContacts' | 'researchStaffContacts' | 'supportStaffContacts';

export async function EmployeeContactsTable({
  employees,
  title,
}: {
  employees: DeanOfficeContactDirectory['teachingStaff'];
  title: Title;
}) {
  const t = await getTranslations('private.dean-office');

  return (
    <section>
      <h3 className="mb-3 font-semibold">{t(title)}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
            </TableRow>
          )}
          {employees.flatMap((employee) => {
            const rows = employee.contacts.length ? employee.contacts : [null];
            const staffValues = [
              employee.fullName,
              employee.workplace,
              employee.position,
              employee.status,
              employee.contractEnd,
            ];
            return rows.map((contact) => (
              <TableRow key={`${employee.employeeId}:${contact?.contactTypeId}:${contact?.value}`}>
                {staffColumns.map((column, index) => (
                  <TableCell key={column} className={column === 'contract' ? 'whitespace-nowrap' : undefined}>
                    {staffValues[index] || '—'}
                  </TableCell>
                ))}
                <TableCell>{contact ? t(`contactTypes.${contact.contactTypeId}`) : '—'}</TableCell>
                <TableCell className="wrap-anywhere">{contact?.value || '—'}</TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </section>
  );
}
