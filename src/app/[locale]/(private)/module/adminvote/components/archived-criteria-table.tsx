'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VoteAdminCriterion } from '@/types/models/vote/administration';

interface Props {
  criteria: VoteAdminCriterion[];
}

export const ArchivedCriteriaTable = ({ criteria }: Props) => {
  const t = useTranslations('private.adminvote.table');

  if (!criteria.length) {
    return <Paragraph className="text-muted-foreground my-0 py-12 text-center text-sm">{t('empty')}</Paragraph>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('coefficient')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {criteria.map((criterion) => (
          <TableRow key={criterion.id} className="text-neutral-600">
            <TableCell className="min-w-64 whitespace-normal">{criterion.name}</TableCell>
            <TableCell>{criterion.coefficient}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
