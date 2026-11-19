import { useTranslations } from 'next-intl';

import { type getDeanOfficeStudents } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

const columns = ['name', 'group', 'course', 'educationLevel'] as const;

export function StudentDirectoryTable({
  students,
  department,
}: {
  students: Awaited<ReturnType<typeof getDeanOfficeStudents>>['students'];
  department?: string;
}) {
  const t = useTranslations('private.dean-office');
  return (
    <div className="pt-4">
      <h2 className="mb-4 text-xl font-semibold">{department ?? t('students')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length ? (
            students.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {
                    <Link className="underline" href={'/module/zdekan/students/' + row.id}>
                      {row.fullName}
                    </Link>
                  }
                </TableCell>
                <TableCell>{row.groupName ?? '—'}</TableCell>
                <TableCell>{row.course ?? '—'}</TableCell>
                <TableCell>{row.educationLevel ?? '—'}</TableCell>
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
