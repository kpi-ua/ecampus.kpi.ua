import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { type SearchParams } from 'nuqs/server';

import { getSessionAdministrationMarks } from '@/actions/session-administration.actions';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { loadSheetSearchParams } from '../../../../../search-params';

const columns = ['discipline', 'assessment', 'mark'] as const;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ sheetId: string; retake: string; studentId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { sheetId, retake, studentId } = await params;
  if (!/^[0-2]$/.test(retake)) {
    notFound();
  }
  const { course } = await loadSheetSearchParams(searchParams);
  const [result, t] = await Promise.all([
    getSessionAdministrationMarks(course, sheetId, Number(retake), studentId),
    getTranslations('private.session-administration'),
  ]);
  if (!result) {
    notFound();
  }

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-4 sm:p-6">
      <h2 className="text-xl font-semibold">{result.name || t('studentMarks')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.marks.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
            </TableRow>
          )}
          {result.marks.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.discipline}</TableCell>
              <TableCell>{row.assessment}</TableCell>
              <TableCell>{row.mark ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
