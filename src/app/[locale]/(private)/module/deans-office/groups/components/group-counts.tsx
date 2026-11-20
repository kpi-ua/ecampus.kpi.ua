import { type ReactNode } from 'react';

import { getDeansOfficeGroupCounts } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { type DeansOfficeOption } from '@/types/models/deans-office';

import { DeansOfficeExport } from '../../components/deans-office-export';
import { DeansOfficeSelect } from '../../components/deans-office-select';
import { type DeansOfficeTranslations } from '../../translations';

export async function GroupCounts({
  t,
  facultyFilter,
  facultyId,
  yearId,
  years,
}: {
  t: DeansOfficeTranslations;
  facultyFilter: ReactNode;
  facultyId: number | null;
  yearId: number | null;
  years: DeansOfficeOption[];
}) {
  const rows = yearId ? await getDeansOfficeGroupCounts(facultyId, yearId) : [];
  return (
    <>
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facultyFilter}
        <DeansOfficeSelect name="yearId" value={yearId} label={t('year')} options={years} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Paragraph>
          {t('groupCount')}: {rows.length} · {t('studentCount')}: {rows.reduce((sum, row) => sum + row.studentCount, 0)}
        </Paragraph>
        <Show when={rows.length > 0}>
          <DeansOfficeExport kind="groups" label={t('export')} query={{ yearId, facultyId }} />
        </Show>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('department')}</TableHead>
            <TableHead>{t('course')}</TableHead>
            <TableHead>{t('group')}</TableHead>
            <TableHead>{t('studentCount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={rows.length > 0} fallback={<TableEmptyRow colSpan={4}>{t('empty')}</TableEmptyRow>}>
            {rows.map((row) => (
              <TableRow key={`${row.department}-${row.course}-${row.groupName}`}>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.groupName}</TableCell>
                <TableCell>{row.studentCount}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </>
  );
}
