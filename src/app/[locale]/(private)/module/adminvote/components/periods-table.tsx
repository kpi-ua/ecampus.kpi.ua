'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { VoteAdminTerm } from '@/types/models/vote/administration';

import { PeriodBadge } from './period-badge';

interface Props {
  periods: VoteAdminTerm[];
  disabled: boolean;
  onEdit: (period: VoteAdminTerm) => void;
  onDelete: (period: VoteAdminTerm) => void;
}

export const PeriodsTable = ({ periods, disabled, onEdit, onDelete }: Props) => {
  const t = useTranslations('private.adminvote.periods.table');

  if (!periods.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('number')}</TableHead>
          <TableHead>{t('year')}</TableHead>
          <TableHead>{t('start')}</TableHead>
          <TableHead>{t('end')}</TableHead>
          <TableHead>{t('status')}</TableHead>
          <TableHead>{t('results')}</TableHead>
          <TableHead>{t('respondent-count')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.map((period) => {
          const handleEdit = () => onEdit(period);
          const handleDelete = () => onDelete(period);

          return (
            <TableRow key={period.id}>
              <TableCell>{period.number}</TableCell>
              <TableCell className="whitespace-nowrap">{period.studyYear}</TableCell>
              <TableCell>{formatDate(period.startsOn)}</TableCell>
              <TableCell>{formatDate(period.endsOn)}</TableCell>
              <TableCell>
                <PeriodBadge period={period} />
              </TableCell>
              <TableCell>{formatDate(period.resultsPublishOn)}</TableCell>
              <TableCell>{period.respondentCount}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="small" variant="secondary" disabled={disabled} onClick={handleEdit}>
                    {t('edit')}
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    className="border-status-danger-200 text-status-danger-300"
                    disabled={disabled || period.respondentCount > 0}
                    onClick={handleDelete}
                  >
                    {t('delete')}
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
