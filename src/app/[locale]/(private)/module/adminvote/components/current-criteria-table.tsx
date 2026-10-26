'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VoteAdminCriterion } from '@/types/models/vote/administration';

interface Props {
  criteria: VoteAdminCriterion[];
  disabled: boolean;
  onEdit: (criterion: VoteAdminCriterion) => void;
  onArchive: (criterion: VoteAdminCriterion) => void;
}

export const CurrentCriteriaTable = ({ criteria, disabled, onEdit, onArchive }: Props) => {
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
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {criteria.map((criterion) => (
          <TableRow key={criterion.id}>
            <TableCell className="min-w-64 whitespace-normal">{criterion.name}</TableCell>
            <TableCell>{criterion.coefficient}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" size="small" disabled={disabled} onClick={() => onEdit(criterion)}>
                  {t('edit')}
                </Button>
                <Button variant="secondary" size="small" disabled={disabled} onClick={() => onArchive(criterion)}>
                  {t('archive')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
