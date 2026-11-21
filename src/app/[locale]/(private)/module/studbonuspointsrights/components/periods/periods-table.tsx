'use client';

import dayjs from 'dayjs';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { SbpPeriod } from '@/types/models/sbp-periods';

import { PeriodBadge } from './period-badge';
import { periodYear, toDay } from './schema';

const DATE = 'DD.MM.YYYY';

/** Appeal runs from the day after OperatorDateEnd to the day before DateExport; none when they are adjacent. */
export const appealRange = (operatorDateEnd: string, dateExport: string | null) => {
  if (!dateExport) {
    return null;
  }
  const from = dayjs(toDay(operatorDateEnd)).add(1, 'day');
  const to = dayjs(toDay(dateExport)).subtract(1, 'day');
  return from.isAfter(to, 'day') ? null : { from, to };
};

export const canEditPeriod = (period: SbpPeriod) => period.state !== 'Finished';

export const canDeletePeriod = (period: SbpPeriod) => period.state === 'Future' && period.recordsCount === 0;

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
              <TableCell className="whitespace-nowrap">
                {formatDate(period.studentDateStart, DATE)} – {formatDate(period.studentDateEnd, DATE)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(period.operatorDateStart, DATE)} – {formatDate(period.operatorDateEnd, DATE)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {appeal ? `${appeal.from.format(DATE)} – ${appeal.to.format(DATE)}` : EMPTY_VALUE}
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(period.dateExport, DATE) || EMPTY_VALUE}</TableCell>
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
