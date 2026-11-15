import { getTranslations } from 'next-intl/server';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { SurveyParticipation } from '@/types/models/statistics';

interface Props {
  items: SurveyParticipation[];
}

export const SurveyParticipationTable = async ({ items }: Props) => {
  const t = await getTranslations('private.yiystat.surveys');

  if (!items.length) {
    return <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">{t('empty')}</Paragraph>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('id')}</TableHead>
          <TableHead>{t('year')}</TableHead>
          <TableHead>{t('start')}</TableHead>
          <TableHead>{t('end')}</TableHead>
          <TableHead>{t('respondents')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell className="whitespace-nowrap">{item.studyYear}</TableCell>
            <TableCell>{formatDate(item.startsOn)}</TableCell>
            <TableCell>{formatDate(item.endsOn)}</TableCell>
            <TableCell>{item.respondentCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
