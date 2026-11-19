'use client';
import { useTranslations } from 'next-intl';

import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanEmployeeActivity } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { formatDate } from '@/lib/utils';
interface Props {
  activity: DeputyDeanEmployeeActivity[];
}
export const DeputyDeanEmployeeActivityTable = ({ activity }: Props) => {
  const t = useTranslations('private.deputy-dean');

  return (
    <Show when={activity.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <DeputyDeanTableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('columns.activityDate')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-pre-wrap">{formatDate(row.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DeputyDeanTableCard>
    </Show>
  );
};
