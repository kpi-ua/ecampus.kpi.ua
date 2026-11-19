import { getTranslations } from 'next-intl/server';

import { Heading3 } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { type DeanOfficeContactDirectory } from '@/types/models/dean-office';

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
      <Heading3 className="mb-3 text-base leading-normal lg:text-base lg:leading-normal">{t(title)}</Heading3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('workplace')}</TableHead>
            <TableHead>{t('position')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('contract')}</TableHead>
            <TableHead>{t('contactType')}</TableHead>
            <TableHead>{t('contactValue')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={employees.length === 0}>
            <TableEmptyRow colSpan={7}>{t('empty')}</TableEmptyRow>
          </Show>
          {employees.flatMap((employee) => {
            const rows = employee.contacts.length ? employee.contacts : [null];
            return rows.map((contact) => (
              <TableRow key={`${employee.employeeId}:${contact?.contactTypeId}:${contact?.value}`}>
                <TableCell>{employee.fullName || EMPTY_VALUE}</TableCell>
                <TableCell>{employee.workplace || EMPTY_VALUE}</TableCell>
                <TableCell>{employee.position || EMPTY_VALUE}</TableCell>
                <TableCell>{employee.status || EMPTY_VALUE}</TableCell>
                <TableCell className="whitespace-nowrap">{employee.contractEnd || EMPTY_VALUE}</TableCell>
                <TableCell>{contact ? t(`contactTypes.${contact.contactTypeId}`) : EMPTY_VALUE}</TableCell>
                <TableCell className="wrap-anywhere">{contact?.value || EMPTY_VALUE}</TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </section>
  );
}
