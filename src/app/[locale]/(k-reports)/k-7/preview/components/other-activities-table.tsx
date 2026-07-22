import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatNumber } from '@/lib/utils';
import { K7OtherEducationalActivity } from '@/types/models/k7-form';

import { EDUCATION_CATEGORY_TITLES } from '../constants';
import { groupOtherActivities } from '../utils/group-other-activities';
import { EmptyTableRow } from './empty-table-row';
import { summaryCellClassName, summaryRowClassName, tableCellClassName, tableHeadClassName } from './table-styles';

interface Props {
  rows: K7OtherEducationalActivity[];
}

const hasSemesterData = (groupCodes: string | null, studentCount: number, hours: number) =>
  Boolean(groupCodes) || studentCount > 0 || hours > 0;

const formatSemesterHours = (hours: number) => (hours > 0 ? formatNumber(hours, 2) : '—');

export const OtherActivitiesTable = ({ rows }: Props) => {
  const semesterHeadClassName = cn(tableHeadClassName, 'h-[32px] text-center');
  const activityGroups = groupOtherActivities(rows);

  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px] [&_td:not(:last-child)]:border-r">
      <colgroup>
        <col className="w-[4%]" />
        <col className="w-[23%]" />
        <col className="w-[8%]" />
        <col className="w-[4%]" />
        <col className="w-[8%]" />
        <col className="w-[10%]" />
        <col className="w-[5%]" />
        <col className="w-[4%]" />
        <col className="w-[8%]" />
        <col className="w-[10%]" />
        <col className="w-[5%]" />
        <col className="w-[11%]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead rowSpan={2} className={tableHeadClassName}>
            №
          </TableHead>
          <TableHead rowSpan={2} colSpan={2} className={tableHeadClassName}>
            Вид роботи
          </TableHead>
          <TableHead colSpan={4} className={semesterHeadClassName}>
            1 семестр
          </TableHead>
          <TableHead colSpan={4} className={semesterHeadClassName}>
            2 семестр
          </TableHead>
          <TableHead rowSpan={2} className={tableHeadClassName}>
            Разом за рік
          </TableHead>
        </TableRow>
        <TableRow className="hover:bg-white">
          <TableHead className={semesterHeadClassName}>Курс</TableHead>
          <TableHead className={semesterHeadClassName}>Шифри груп</TableHead>
          <TableHead className={semesterHeadClassName}>К-сть здобувачів</TableHead>
          <TableHead className={semesterHeadClassName}>Годин</TableHead>
          <TableHead className={semesterHeadClassName}>Курс</TableHead>
          <TableHead className={semesterHeadClassName}>Шифри груп</TableHead>
          <TableHead className={semesterHeadClassName}>К-сть здобувачів</TableHead>
          <TableHead className={semesterHeadClassName}>Годин</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && <EmptyTableRow colSpan={12} />}
        {activityGroups.map((group, groupIndex) =>
          group.rows.map((row, rowIndex) => {
            const hasFirstSemesterData = hasSemesterData(row.groupCodesSem1, row.studentCountSem1, row.hoursSem1);
            const hasSecondSemesterData = hasSemesterData(row.groupCodesSem2, row.studentCountSem2, row.hoursSem2);

            return (
              <TableRow
                key={`${group.workType}-${row.course}-${row.groupCodesSem1}-${row.groupCodesSem2}-${rowIndex}`}
                className="hover:bg-white"
              >
                {rowIndex === 0 && (
                  <>
                    <TableCell rowSpan={group.rows.length} className={tableCellClassName}>
                      {groupIndex + 1}
                    </TableCell>
                    <TableCell rowSpan={group.rows.length} className={tableCellClassName}>
                      {group.workType}
                    </TableCell>
                  </>
                )}
                <TableCell className={tableCellClassName}>{EDUCATION_CATEGORY_TITLES[row.educationCategory]}</TableCell>
                <TableCell className={tableCellClassName}>{hasFirstSemesterData ? (row.course ?? '—') : '—'}</TableCell>
                <TableCell className={tableCellClassName}>{row.groupCodesSem1 || '—'}</TableCell>
                <TableCell className={tableCellClassName}>
                  {hasFirstSemesterData ? row.studentCountSem1 : '—'}
                </TableCell>
                <TableCell className={tableCellClassName}>{formatSemesterHours(row.hoursSem1)}</TableCell>
                <TableCell className={tableCellClassName}>
                  {hasSecondSemesterData ? (row.course ?? '—') : '—'}
                </TableCell>
                <TableCell className={tableCellClassName}>{row.groupCodesSem2 || '—'}</TableCell>
                <TableCell className={tableCellClassName}>
                  {hasSecondSemesterData ? row.studentCountSem2 : '—'}
                </TableCell>
                <TableCell className={tableCellClassName}>{formatSemesterHours(row.hoursSem2)}</TableCell>
                <TableCell className={tableCellClassName}>{formatNumber(row.grandTotal, 2)}</TableCell>
              </TableRow>
            );
          }),
        )}
        {rows.length > 0 && (
          <TableRow className={summaryRowClassName}>
            <TableCell colSpan={3} className={summaryCellClassName}>
              Разом
            </TableCell>
            <TableCell colSpan={3} className={summaryCellClassName} />
            <TableCell className={summaryCellClassName}>
              {formatSemesterHours(rows.reduce((total, row) => total + row.hoursSem1, 0))}
            </TableCell>
            <TableCell colSpan={3} className={summaryCellClassName} />
            <TableCell className={summaryCellClassName}>
              {formatSemesterHours(rows.reduce((total, row) => total + row.hoursSem2, 0))}
            </TableCell>
            <TableCell className={summaryCellClassName}>
              {formatNumber(
                rows.reduce((total, row) => total + row.grandTotal, 0),
                2,
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
