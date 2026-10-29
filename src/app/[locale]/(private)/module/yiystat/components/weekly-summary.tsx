'use client';

import { useTranslations } from 'next-intl';

import { Heading3 } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VisitTotals } from '@/types/models/statistics';

interface Props {
  totals: VisitTotals;
}

export const WeeklySummary = ({ totals }: Props) => {
  const t = useTranslations('private.yiystat.visits');

  return (
    <section className="flex flex-col gap-4">
      <Heading3>{t('weekly-summary')}</Heading3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('visitor-type')}</TableHead>
            <TableHead>{t('unique-visitors')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{t('lecturers')}</TableCell>
            <TableCell>{totals.lecturers}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('all-students')}</TableCell>
            <TableCell>{totals.students}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};
