import { getTranslations } from 'next-intl/server';

import { Heading2 } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { type Employee } from '@/types/models/dean-office';

export async function EmployeeDirectoryTable({
  employees,
  department,
}: {
  employees: Employee[];
  department?: string;
}) {
  const t = await getTranslations('private.dean-office');
  return (
    <div className="pt-4">
      <Heading2 className="mb-4 text-xl leading-7 lg:text-xl lg:leading-7">{department ?? t('employees')}</Heading2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('department')}</TableHead>
            <TableHead>{t('position')}</TableHead>
            <TableHead>{t('employment')}</TableHead>
            <TableHead>{t('status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={employees.length > 0} fallback={<TableEmptyRow colSpan={5}>{t('empty')}</TableEmptyRow>}>
            {employees.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.department ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.position ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.employment ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.status ?? EMPTY_VALUE}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </div>
  );
}
