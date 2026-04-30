'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { SbpResponsibilityListItem } from '@/types/models/sbp-rights';
import { RevokeButton } from './revoke-button';

interface Props {
  items: SbpResponsibilityListItem[];
}

export function RightsTable({ items }: Props) {
  const t = useTranslations('private.studbonuspointsrights');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.user')}</TableHead>
          <TableHead>{t('table.scope')}</TableHead>
          <TableHead>{t('table.subdivision')}</TableHead>
          <TableHead>{t('table.year')}</TableHead>
          <TableHead>{t('table.load')}</TableHead>
          <TableHead>{t('table.created')}</TableHead>
          <TableHead className="w-12 text-right">
            <span className="sr-only">{t('table.actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.fullName}</TableCell>
            <TableCell>
              <Badge variant={item.scope === 'University' ? 'purple' : 'blue'}>
                {t(`scope.${item.scope === 'University' ? 'university' : 'faculty'}`)}
              </Badge>
            </TableCell>
            <TableCell>{item.subdivisionAbbreviation ?? item.subdivisionName}</TableCell>
            <TableCell>{item.studyingYearName}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>
                  {item.loadSubTreeNumber != null ? `${item.loadSubTreeNumber}. ` : ''}
                  {item.loadName}
                </span>
                <span className="text-muted-foreground text-xs">
                  {item.workKindName} · {item.treeName}
                </span>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap">{formatDate(item.changeDate)}</TableCell>
            <TableCell className="text-right">
              <RevokeButton item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
