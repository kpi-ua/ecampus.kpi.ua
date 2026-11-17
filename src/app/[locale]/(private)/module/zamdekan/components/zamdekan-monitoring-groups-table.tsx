'use client';

import { useTranslations } from 'next-intl';

import { ZamdekanView } from '@/app/[locale]/(private)/module/zamdekan/constants';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { ZamdekanMonitoringGroup } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';
import { ZamdekanTableCard } from './zamdekan-table-card';

interface Props {
  groups: ZamdekanMonitoringGroup[];
  departmentId: number;
}
export const ZamdekanMonitoringGroupsTable = ({ groups, departmentId }: Props) => {
  const t = useTranslations('private.zamdekan');

  if (groups.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <ZamdekanTableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columns.course')}</TableHead>
            <TableHead>{t('columns.group')}</TableHead>
            <TableHead>{t('columns.disciplineCount')}</TableHead>
            <TableHead>{t('columns.sheetCount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-pre-wrap">{row.course}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  className="underline"
                  href={getZamdekanReportPath({ view: ZamdekanView.GroupLoad, departmentId, groupId: row.groupId })}
                >
                  {row.group}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.disciplineCount}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.sheetCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ZamdekanTableCard>
  );
};
