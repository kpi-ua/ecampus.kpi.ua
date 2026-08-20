import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';
import { K7DetailedAchievement } from '@/types/models/k7-form';

import { EmptyTableRow } from './empty-table-row';
import { summaryCellClassName, summaryRowClassName, tableCellClassName, tableHeadClassName } from './table-styles';

interface Props {
  rows: K7DetailedAchievement[];
}

export const DepartmentWorkTable = ({ rows }: Props) => {
  const t = useTranslations('private.k-7.preview.table');

  return (
    <Table className="leading-xs table-fixed border-collapse text-xs">
      <colgroup>
        <col className="w-[5%]" />
        <col className="w-[22%]" />
        <col className="w-[35%]" />
        <col className="w-[8%]" />
        <col className="w-[18%]" />
        <col className="w-[12%]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className={tableHeadClassName}>{t('number')}</TableHead>
          <TableHead className={tableHeadClassName}>{t('workType')}</TableHead>
          <TableHead className={tableHeadClassName}>{t('workDescription')}</TableHead>
          <TableHead className={`${tableHeadClassName} text-right [&>span]:justify-end`}>{t('hoursShort')}</TableHead>
          <TableHead className={tableHeadClassName}>{t('proof')}</TableHead>
          <TableHead className={tableHeadClassName}>{t('department')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && <EmptyTableRow colSpan={6} />}
        {rows.map((row, index) => (
          <TableRow key={`${row.workType}-${row.workDescription}-${index}`} className="hover:bg-white">
            <TableCell className={tableCellClassName}>{index + 1}</TableCell>
            <TableCell className={`${tableCellClassName} [overflow-wrap:anywhere]`}>
              {row.workTypeDescription}
            </TableCell>
            <TableCell className={`${tableCellClassName} [overflow-wrap:anywhere]`}>{row.workDescription}</TableCell>
            <TableCell className={`${tableCellClassName} text-right whitespace-nowrap`}>
              {formatNumber(row.hoursUsed, 2)}
            </TableCell>
            <TableCell className={`${tableCellClassName} [overflow-wrap:anywhere] whitespace-normal`}>
              {row.proofOfPerformance || '—'}
            </TableCell>
            <TableCell className={`${tableCellClassName} [overflow-wrap:anywhere]`}>
              {row.responsibleDepartment || '—'}
            </TableCell>
          </TableRow>
        ))}
        {rows.length > 0 && (
          <TableRow className={summaryRowClassName}>
            <TableCell colSpan={5} className={summaryCellClassName}>
              {t('total')}
            </TableCell>
            <TableCell className={`${summaryCellClassName} text-right`}>
              {formatNumber(
                rows.reduce((total, row) => total + row.hoursUsed, 0),
                0,
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
