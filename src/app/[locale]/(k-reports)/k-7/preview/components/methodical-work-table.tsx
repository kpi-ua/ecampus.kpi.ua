import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';
import { K7DetailedAchievement } from '@/types/models/k7-form';

import { EmptyTableRow } from './empty-table-row';
import { summaryCellClassName, summaryRowClassName, tableCellClassName, tableHeadClassName } from './table-styles';

interface Props {
  rows: K7DetailedAchievement[];
}

export const MethodicalWorkTable = ({ rows }: Props) => (
  <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
    <colgroup>
      <col className="w-[5%]" />
      <col className="w-[20%]" />
      <col className="w-[38%]" />
      <col className="w-[29%]" />
      <col className="w-[8%]" />
    </colgroup>
    <TableHeader>
      <TableRow className="hover:bg-white">
        <TableHead className={tableHeadClassName}>№</TableHead>
        <TableHead className={tableHeadClassName}>Вид роботи</TableHead>
        <TableHead className={tableHeadClassName}>Опис</TableHead>
        <TableHead className={tableHeadClassName}>Підтвердження</TableHead>
        <TableHead className={`${tableHeadClassName} text-right [&>span]:justify-end`}>Годин</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.length === 0 && <EmptyTableRow colSpan={5} />}
      {rows.map((row, index) => (
        <TableRow key={`${row.workType}-${row.workDescription}-${index}`} className="hover:bg-white">
          <TableCell className={tableCellClassName}>{index + 1}</TableCell>
          <TableCell className={`${tableCellClassName} wrap-anywhere`}>{row.workTypeDescription}</TableCell>
          <TableCell className={`${tableCellClassName} wrap-anywhere`}>{row.workDescription}</TableCell>
          <TableCell className={`${tableCellClassName} wrap-anywhere whitespace-normal`}>
            {row.proofOfPerformance || '—'}
          </TableCell>
          <TableCell className={`${tableCellClassName} text-right whitespace-nowrap`}>
            {formatNumber(row.hoursUsed, 2)}
          </TableCell>
        </TableRow>
      ))}
      {rows.length > 0 && (
        <TableRow className={summaryRowClassName}>
          <TableCell colSpan={4} className={summaryCellClassName}>
            Разом
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
