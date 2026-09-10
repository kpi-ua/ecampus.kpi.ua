import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatNumber } from '@/lib/utils';
import { K7DetailedAchievement, K7OtherEducationalActivity } from '@/types/models/k7-form';

import { EDUCATION_LEVEL_TRANSLATION_KEYS } from '../constants';
import { groupOtherActivities } from '../utils/group-other-activities';
import { EmptyTableRow } from './empty-table-row';
import { summaryCellClassName, summaryRowClassName, tableCellClassName, tableHeadClassName } from './table-styles';

interface Props {
  rows: K7OtherEducationalActivity[];
  /**
   * Achievements booked as educational work. They carry no course, groups or semester once their
   * periods are merged, so they fill the work-type and year-total cells only, as in the document.
   */
  achievements?: K7DetailedAchievement[];
}

const achievementLabel = (achievement: K7DetailedAchievement) =>
  achievement.workDescription
    ? `${achievement.workTypeDescription}. ${achievement.workDescription}`
    : achievement.workTypeDescription;

const hasSemesterData = (groupCodes: string | null, studentCount: number, hours: number) =>
  Boolean(groupCodes) || studentCount > 0 || hours > 0;

const formatSemesterHours = (hours: number) => (hours > 0 ? formatNumber(hours, 2) : '—');

export const OtherActivitiesTable = ({ rows, achievements = [] }: Props) => {
  const t = useTranslations('private.k-7.preview');
  const semesterHeadClassName = cn(tableHeadClassName, 'h-[32px] text-center');
  const borderedSemesterHeadClassName = cn(semesterHeadClassName, 'border-neutral-divider border-x');
  const activityGroups = groupOtherActivities(rows);
  const achievementHours = achievements.reduce((total, item) => total + item.hoursUsed, 0);
  const isEmpty = rows.length === 0 && achievements.length === 0;

  return (
    <Table className="leading-xs table-fixed border-collapse text-xs [&_td:not(:last-child)]:border-r">
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
            {t('table.number')}
          </TableHead>
          <TableHead rowSpan={2} colSpan={2} className={tableHeadClassName}>
            {t('table.workType')}
          </TableHead>
          <TableHead colSpan={4} className={borderedSemesterHeadClassName}>
            {t('table.semester', { semester: 1 })}
          </TableHead>
          <TableHead colSpan={4} className={borderedSemesterHeadClassName}>
            {t('table.semester', { semester: 2 })}
          </TableHead>
          <TableHead rowSpan={2} className={tableHeadClassName}>
            {t('table.yearTotal')}
          </TableHead>
        </TableRow>
        <TableRow className="hover:bg-white">
          <TableHead className={borderedSemesterHeadClassName}>{t('table.course')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.groupCodes')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.studentsCount')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.hours')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.course')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.groupCodes')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.studentsCount')}</TableHead>
          <TableHead className={borderedSemesterHeadClassName}>{t('table.hours')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isEmpty && <EmptyTableRow colSpan={12} />}
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
                <TableCell className={tableCellClassName}>
                  {t(`educationLevel.${EDUCATION_LEVEL_TRANSLATION_KEYS[row.educationLevel]}`)}
                </TableCell>
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
        {achievements.map((achievement, index) => (
          <TableRow key={`achievement-${index}-${achievement.workTypeDescription}`} className="hover:bg-white">
            <TableCell className={tableCellClassName}>{activityGroups.length + index + 1}</TableCell>
            <TableCell colSpan={2} className={tableCellClassName}>
              {achievementLabel(achievement)}
            </TableCell>
            <TableCell colSpan={4} className={tableCellClassName} />
            <TableCell colSpan={4} className={tableCellClassName} />
            <TableCell className={tableCellClassName}>{formatNumber(achievement.hoursUsed, 2)}</TableCell>
          </TableRow>
        ))}
        {!isEmpty && (
          <TableRow className={summaryRowClassName}>
            <TableCell colSpan={3} className={summaryCellClassName}>
              {t('table.total')}
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
              {formatNumber(rows.reduce((total, row) => total + row.grandTotal, 0) + achievementHours, 2)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
