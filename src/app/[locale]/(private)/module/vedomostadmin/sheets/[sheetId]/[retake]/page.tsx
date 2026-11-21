import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { type SearchParams } from 'nuqs/server';

import { getSessionAdministrationSheet } from '@/actions/session-administration.actions';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { formatDate } from '@/lib/utils';

import { loadSheetSearchParams } from '../../../search-params';

const columns = ['name', 'view', 'mark', 'attendance', 'notes'] as const;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ sheetId: string; retake: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { sheetId, retake } = await params;
  if (!/^[0-2]$/.test(retake)) {
    notFound();
  }
  const { course } = await loadSheetSearchParams(searchParams);
  const [data, t] = await Promise.all([
    getSessionAdministrationSheet(course, sheetId, Number(retake)),
    getTranslations('private.session-administration'),
  ]);
  if (!data) {
    notFound();
  }
  const { sheet, students } = data;
  const date = (value: string | null) => (value ? formatDate(value, 'DD.MM.YYYY HH:mm') : '—');
  const fields = [
    [t('number'), sheet.number],
    [t('group'), sheet.group],
    [t('opensAt'), date(sheet.opensAt)],
    [t('examAt'), date(sheet.examAt)],
    [t('closesAt'), date(sheet.closesAt)],
    [t('assessment'), sheet.assessment],
    [t('retake'), t(sheet.retake === 0 ? 'main' : 'retakeOption', { number: sheet.retake })],
    [t('lecturer'), sheet.lecturer],
    [t('status'), t(sheet.status)],
  ];

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-4 sm:p-6">
      <h2 className="text-xl font-semibold">{sheet.discipline}</h2>
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label} className="space-y-1">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd>{value ?? '—'}</dd>
          </div>
        ))}
      </dl>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
            </TableRow>
          )}
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                <Link
                  className="underline"
                  href={{
                    pathname:
                      '/module/vedomostadmin/sheets/' +
                      encodeURIComponent(sheetId) +
                      '/' +
                      retake +
                      '/students/' +
                      encodeURIComponent(student.id),
                    query: { course },
                  }}
                >
                  {t('view')}
                </Link>
              </TableCell>
              <TableCell>{student.mark ?? '—'}</TableCell>
              <TableCell>
                {student.attendance && ['0', '-1', '-2', '-3'].includes(student.attendance)
                  ? t('attendanceValues.' + student.attendance)
                  : '—'}
              </TableCell>
              <TableCell>{student.notes ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
