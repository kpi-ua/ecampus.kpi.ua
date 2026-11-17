'use client';

import { useTranslations } from 'next-intl';

import { ZamdekanView } from '@/app/[locale]/(private)/module/zamdekan/constants';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { ZamdekanMonitoringSheet } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';
import { ZamdekanTableCard } from './zamdekan-table-card';

interface Props {
  sheets: ZamdekanMonitoringSheet[];
  departmentId: number;
  employeeId: number;
}
export const ZamdekanEmployeeSheetsTable = ({ sheets, departmentId, employeeId }: Props) => {
  const t = useTranslations('private.zamdekan');

  if (sheets.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <ZamdekanTableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columns.course')}</TableHead>
            <TableHead>{t('columns.group')}</TableHead>
            <TableHead>{t('columns.reportModule')}</TableHead>
            <TableHead>{t('columns.sheetName')}</TableHead>
            <TableHead>{t('columns.assessmentCount')}</TableHead>
            <TableHead>{t('columns.markCount')}</TableHead>
            <TableHead>{t('columns.employee')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheets.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-pre-wrap">{row.course}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  className="underline"
                  href={getZamdekanReportPath({
                    view: ZamdekanView.Sheet,
                    departmentId,
                    employeeId,
                    groupId: row.groupId,
                    disciplineId: row.disciplineId,
                    monitoringId: row.sheetId,
                  })}
                >
                  {row.name}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.assessmentCount}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.markCount}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ZamdekanTableCard>
  );
};
