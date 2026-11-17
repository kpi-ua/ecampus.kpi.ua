'use client';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { ZamdekanEmployeeDiscipline } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';
import { ZamdekanTableCard } from './zamdekan-table-card';

interface Props {
  disciplines: ZamdekanEmployeeDiscipline[];
  departmentId: number;
}
export const ZamdekanEmployeeDisciplinesTable = ({ disciplines, departmentId }: Props) => {
  const t = useTranslations('private.zamdekan');

  if (disciplines.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <ZamdekanTableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>{t('columns.group')}</TableHead>
            <TableHead>{t('columns.reportName')}</TableHead>
            <TableHead>{t('columns.discipline')}</TableHead>
            <TableHead>{t('columns.teachingTypes')}</TableHead>
            <TableHead>{t('columns.reportSheetCount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disciplines.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-pre-wrap">{index + 1}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.teachingTypes?.split(',').join('\n')}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  className="underline"
                  href={getZamdekanReportPath({
                    view: 'sheets',
                    departmentId,
                    employeeId: row.employeeId,
                    groupId: row.groupId,
                    disciplineId: row.disciplineId,
                  })}
                >
                  {row.sheetCount}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ZamdekanTableCard>
  );
};
