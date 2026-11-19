import { useTranslations } from 'next-intl';

import { type getDeanOfficeEmployees } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const columns = ['name', 'department', 'position', 'employment', 'status'] as const;

export function EmployeeDirectoryTable({
  employees,
  department,
}: {
  employees: Awaited<ReturnType<typeof getDeanOfficeEmployees>>;
  department?: string;
}) {
  const t = useTranslations('private.dean-office');
  return (
    <div className="pt-4">
      <h2 className="mb-4 text-xl font-semibold">{department ?? t('employees')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length ? (
            employees.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName ?? '—'}</TableCell>
                <TableCell>{row.department ?? '—'}</TableCell>
                <TableCell>{row.position ?? '—'}</TableCell>
                <TableCell>{row.employment ?? '—'}</TableCell>
                <TableCell>{row.status ?? '—'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
