'use client';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

import { ZamdekanEmployeeActivity } from '../types';
import { ZamdekanTableCard } from './zamdekan-table-card';
interface Props {
  activity: ZamdekanEmployeeActivity[];
}
export const ZamdekanEmployeeActivityTable = ({ activity }: Props) => {
  const t = useTranslations('private.zamdekan');

  if (activity.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <ZamdekanTableCard>
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
    </ZamdekanTableCard>
  );
};
