import { Fragment } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatNumber } from '@/lib/utils';
import { K7TeachingDiscipline } from '@/types/models/k7-form';

import { EmptyTableRow } from './empty-table-row';
import {
  semesterRowClassName,
  summaryCellClassName,
  summaryRowClassName,
  tableCellClassName,
  tableHeadClassName,
} from './table-styles';

interface Props {
  rows: K7TeachingDiscipline[];
}

export const TeachingDisciplinesTable = ({ rows }: Props) => {
  const semesters = [...new Set(rows.map((row) => row.semester))].sort((a, b) => a - b);
  const teachingTableHeadClassName = cn(tableHeadClassName, 'h-[72px] align-middle');

  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <colgroup>
        <col className="w-[4%]" />
        <col className="w-[31%]" />
        <col className="w-[12%]" />
        <col className="w-[15%]" />
        <col className="w-[14%]" />
        <col className="w-[13%]" />
        <col className="w-[11%]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className={teachingTableHeadClassName}>№</TableHead>
          <TableHead className={teachingTableHeadClassName}>
            Факультет (ННІ), який забезпечується потоку; абрев., назва освітнього компонента
          </TableHead>
          <TableHead className={teachingTableHeadClassName}>Ідентифікатор потоку</TableHead>
          <TableHead className={teachingTableHeadClassName}>Шифри академічних груп у потоці, к-сть студентів</TableHead>
          <TableHead className={teachingTableHeadClassName}>Обсяг освітнього компонента за семестр</TableHead>
          <TableHead className={teachingTableHeadClassName}>К-сть навч. груп практ.</TableHead>
          <TableHead className={teachingTableHeadClassName}>К-сть навч. груп лаб.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {semesters.length === 0 && <EmptyTableRow colSpan={7} />}
        {semesters.map((semester) => {
          const semesterRows = rows.filter((row) => row.semester === semester);

          return (
            <Fragment key={semester}>
              <TableRow className={semesterRowClassName}>
                <TableCell colSpan={7} className={summaryCellClassName}>
                  {semester} семестр
                </TableCell>
              </TableRow>
              {semesterRows.map((row, index) => (
                <TableRow key={`${row.subjectName}-${row.streamId}-${index}`} className="hover:bg-white">
                  <TableCell className={tableCellClassName}>{index + 1}</TableCell>
                  <TableCell className={tableCellClassName}>{row.subjectName}</TableCell>
                  <TableCell className={tableCellClassName}>{row.streamId || '—'}</TableCell>
                  <TableCell className={tableCellClassName}>{row.groupCodes || '—'}</TableCell>
                  <TableCell className={tableCellClassName}>{formatNumber(row.totalVolume, 2)}</TableCell>
                  <TableCell className={tableCellClassName}>{row.practiceGroupsCount}</TableCell>
                  <TableCell className={tableCellClassName}>{row.labGroupsCount}</TableCell>
                </TableRow>
              ))}
              <TableRow className={summaryRowClassName}>
                <TableCell colSpan={4} className={summaryCellClassName}>
                  Разом за {semester} семестр
                </TableCell>
                <TableCell className={summaryCellClassName}>
                  {formatNumber(
                    semesterRows.reduce((total, row) => total + row.totalVolume, 0),
                    2,
                  )}
                </TableCell>
                <TableCell className={summaryCellClassName}>
                  {semesterRows.reduce((total, row) => total + row.practiceGroupsCount, 0)}
                </TableCell>
                <TableCell className={summaryCellClassName}>
                  {semesterRows.reduce((total, row) => total + row.labGroupsCount, 0)}
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
        {rows.length > 0 && (
          <TableRow className={summaryRowClassName}>
            <TableCell colSpan={4} className={summaryCellClassName}>
              Разом за навчальний рік
            </TableCell>
            <TableCell className={summaryCellClassName}>
              {formatNumber(
                rows.reduce((total, row) => total + row.totalVolume, 0),
                2,
              )}
            </TableCell>
            <TableCell className={summaryCellClassName}>
              {rows.reduce((total, row) => total + row.practiceGroupsCount, 0)}
            </TableCell>
            <TableCell className={summaryCellClassName}>
              {rows.reduce((total, row) => total + row.labGroupsCount, 0)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
