import { getTranslations } from 'next-intl/server';
import { sum } from 'radash';

import { getDeansOfficeGroupCounts } from '@/actions/deans-office.actions';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { ExportButton } from '../components/export-button';
import { INTL_NAMESPACE } from '../translations';

export default async function GroupsPage() {
  const [rows, t] = await Promise.all([getDeansOfficeGroupCounts(), getTranslations(INTL_NAMESPACE)]);
  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex flex-col gap-1 text-sm leading-tight">
          <span>
            {t('groupCount')}: {rows.length}
          </span>
          <span>
            {t('studentCount')}: {sum(rows, (row) => row.studentCount)}
          </span>
        </div>
        <Show when={rows.length > 0}>
          <div className="ml-auto shrink-0">
            <ExportButton kind="groups" label={t('export')} />
          </div>
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
