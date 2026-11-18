'use client';

import { useTranslations } from 'next-intl';

import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { DeputyDeanMonitoringGroup } from '../types';
import { getDeputyDeanReportPath } from '../utils/report-path';
import { DeputyDeanTableCard } from './deputy-dean-table-card';

interface Props {
  groups: DeputyDeanMonitoringGroup[];
  departmentId: number;
}
export const DeputyDeanMonitoringGroupsTable = ({ groups, departmentId }: Props) => {
  const t = useTranslations('private.deputy-dean');

  if (groups.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <DeputyDeanTableCard>
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
                  href={getDeputyDeanReportPath({ view: DeputyDeanView.GroupLoad, departmentId, groupId: row.groupId })}
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
    </DeputyDeanTableCard>
  );
};
