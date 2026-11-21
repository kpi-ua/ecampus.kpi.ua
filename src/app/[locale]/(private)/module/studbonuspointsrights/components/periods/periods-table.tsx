'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DATE_FORMAT, EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { SbpPeriod } from '@/types/models/sbp-periods';

import { PeriodBadge } from './period-badge';
import { appealRange, canDeletePeriod, canEditPeriod, periodYear } from './utils';

/** A range that breaks after the dash, so nine columns fit without a horizontal scroll. */
const DateRange = ({ from, to }: { from: string; to: string }) => (
  <>
    <span className="whitespace-nowrap">{from} –</span> <span className="whitespace-nowrap">{to}</span>
  </>
);

interface Props {
  periods: SbpPeriod[];
  disabled: boolean;
  onEdit: (period: SbpPeriod) => void;
  onDelete: (period: SbpPeriod) => void;
}

export const PeriodsTable = ({ periods, disabled, onEdit, onDelete }: Props) => {
  const t = useTranslations('private.studbonuspointsrights.periods.table');

  if (!periods.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('year')}</TableHead>
          <TableHead>{t('semester')}</TableHead>
          <TableHead>{t('submission')}</TableHead>
          <TableHead>{t('review')}</TableHead>
          <TableHead>{t('appeal')}</TableHead>
          <TableHead>{t('export')}</TableHead>
          <TableHead>{t('phase')}</TableHead>
          <TableHead className="text-right">{t('records')}</TableHead>
          <TableHead>
            <span className="sr-only">{t('actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.map((period) => {
          const appeal = appealRange(period.operatorDateEnd, period.dateExport);
          const handleEdit = () => onEdit(period);
          const handleDelete = () => onDelete(period);

          return (
            <TableRow key={period.id}>
              <TableCell className="whitespace-nowrap">{periodYear(period.studyingYearName)}</TableCell>
              <TableCell>{period.semester}</TableCell>
              <TableCell>
                <DateRange
                  from={formatDate(period.studentDateStart, DATE_FORMAT)}
                  to={formatDate(period.studentDateEnd, DATE_FORMAT)}
                />
              </TableCell>
              <TableCell>
                <DateRange
                  from={formatDate(period.operatorDateStart, DATE_FORMAT)}
                  to={formatDate(period.operatorDateEnd, DATE_FORMAT)}
                />
              </TableCell>
              <TableCell>
                {appeal ? (
                  <DateRange from={appeal.from.format(DATE_FORMAT)} to={appeal.to.format(DATE_FORMAT)} />
                ) : (
                  EMPTY_VALUE
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(period.dateExport, DATE_FORMAT) || EMPTY_VALUE}
              </TableCell>
              <TableCell>
                <PeriodBadge phase={period.phase} />
              </TableCell>
              <TableCell className="text-right">{period.recordsCount}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="tertiary"
                    size="small"
                    title={t('edit')}
                    disabled={disabled || !canEditPeriod(period)}
                    onClick={handleEdit}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t('edit')}</span>
                  </Button>
                  <Button
                    variant="tertiary"
                    size="small"
                    title={t('delete')}
                    className="text-status-danger-300 hover:text-red-700"
                    disabled={disabled || !canDeletePeriod(period)}
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t('delete')}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
