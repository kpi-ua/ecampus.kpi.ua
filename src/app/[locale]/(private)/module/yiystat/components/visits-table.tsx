import { getTranslations } from 'next-intl/server';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { DailyVisits } from '@/types/models/statistics';

interface Props {
  items: DailyVisits[];
}

export const VisitsTable = async ({ items }: Props) => {
  const t = await getTranslations('private.yiystat.visits');

  if (!items.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('lecturers')}</TableHead>
          <TableHead>{t('students')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.date}>
            <TableCell>{formatDate(item.date)}</TableCell>
            <TableCell>{item.lecturers}</TableCell>
            <TableCell>{item.students}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
