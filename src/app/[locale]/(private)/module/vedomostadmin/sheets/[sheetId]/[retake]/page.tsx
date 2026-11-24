import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { type SearchParams } from 'nuqs/server';

import { getSessionAdministrationSheet } from '@/actions/session-administration.actions';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDateOrPlaceholder } from '@/lib/utils';

import { loadSheetSearchParams } from '../../../search-params';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ sheetId: string; retake: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { sheetId, retake } = await params;

  const { course } = await loadSheetSearchParams(searchParams);
  const [data, t] = await Promise.all([
    getSessionAdministrationSheet(course, sheetId, Number(retake)),
    getTranslations('private.session-administration'),
  ]);
  if (!data) {
    notFound();
  }
  const { sheet, students } = data;

  const fields = [
    [t('number'), sheet.number],
    [t('group'), sheet.group],
    [t('opensAt'), formatDateOrPlaceholder(sheet.opensAt, 'DD.MM.YYYY HH:mm')],
    [t('examAt'), formatDateOrPlaceholder(sheet.examAt, 'DD.MM.YYYY HH:mm')],
    [t('closesAt'), formatDateOrPlaceholder(sheet.closesAt, 'DD.MM.YYYY HH:mm')],
    [t('assessment'), sheet.assessment],
    [t('retake'), t(sheet.retake === 0 ? 'main' : 'retakeOption', { number: sheet.retake })],
    [t('lecturer'), sheet.lecturer],
    [t('status'), t(sheet.status)],
  ];

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-4 sm:p-6">
      <Heading2 className="text-xl leading-tight lg:text-xl lg:leading-tight">{sheet.discipline}</Heading2>
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label} className="space-y-1">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div>{value ?? EMPTY_VALUE}</div>
          </div>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('view')}</TableHead>
            <TableHead>{t('mark')}</TableHead>
            <TableHead>{t('attendance')}</TableHead>
            <TableHead>{t('notes')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>{t('empty')}</TableCell>
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
              <TableCell>{student.mark ?? EMPTY_VALUE}</TableCell>
              <TableCell>{student.attendance ? t(`attendanceValues.${student.attendance}`) : EMPTY_VALUE}</TableCell>
              <TableCell>{student.notes ?? EMPTY_VALUE}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
