'use client';

import { useTranslations } from 'next-intl';

import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanExamStatus, DeputyDeanMarkStatus } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { DeputyDeanExamResult } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';

interface Props {
  results: DeputyDeanExamResult[];
}

export const DeputyDeanResultsTable = ({ results }: Props) => {
  const t = useTranslations('private.deputy-dean');
  const markLabels = {
    [DeputyDeanMarkStatus.Missing]: '',
    [DeputyDeanMarkStatus.NotAdmitted]: t('values.not-admitted'),
    [DeputyDeanMarkStatus.NotGraded]: t('values.not-graded'),
  };
  const statusLabels = {
    [DeputyDeanExamStatus.Submitted]: t('values.submitted'),
    [DeputyDeanExamStatus.Closed]: t('values.closed'),
    [DeputyDeanExamStatus.Pending]: t('values.pending'),
    [DeputyDeanExamStatus.Editing]: t('values.editing'),
  };
  return (
    <Show
      when={results.length > 0}
      fallback={<Paragraph className="py-12 text-center text-sm text-muted-foreground">{t('empty')}</Paragraph>}
    >
      <div className="space-y-4">
        <DeputyDeanTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.part')}</TableHead>
                <TableHead>{t('columns.eventDate')}</TableHead>
                <TableHead>{t('columns.discipline')}</TableHead>
                <TableHead>{t('columns.controlForm')}</TableHead>
                <TableHead>{t('columns.examiner')}</TableHead>
                <TableHead>{t('columns.mark')}</TableHead>
                <TableHead>{t('columns.nationalScale')}</TableHead>
                <TableHead>{t('columns.examStatus')}</TableHead>
                <TableHead>{t('columns.opensAt')}</TableHead>
                <TableHead>{t('columns.closesAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row, index) => (
                <TableRow key={`${row.discipline}-${row.part}-${row.eventDate}-${index}`}>
                  <TableCell className="whitespace-pre-wrap">
                    {[0, 1, 2].includes(row.part) ? t(`values.part-${row.part}`) : row.part}
                  </TableCell>
                  <TableCell className="whitespace-pre-wrap">{formatDate(row.eventDate)}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.controlForm}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.examiner}</TableCell>
                  <TableCell className="whitespace-pre-wrap">
                    {row.markStatus === DeputyDeanMarkStatus.Graded ? row.mark : markLabels[row.markStatus]}
                  </TableCell>
                  <TableCell className="whitespace-pre-wrap">{row.nationalScale ?? EMPTY_VALUE}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{statusLabels[row.status]}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{formatDate(row.opensAt)}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{formatDate(row.closesAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DeputyDeanTableCard>
      </div>
    </Show>
  );
};
