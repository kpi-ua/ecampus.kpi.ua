'use client';

import { useTranslations } from 'next-intl';

import { ZamdekanView } from '@/app/[locale]/(private)/module/zamdekan/constants';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { ZamdekanEmployee } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';
import { ZamdekanTableCard } from './zamdekan-table-card';

interface Props {
  employees: ZamdekanEmployee[];
  departmentId: number;
}
export const ZamdekanEmployeesTable = ({ employees, departmentId }: Props) => {
  const t = useTranslations('private.zamdekan');

  if (employees.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <ZamdekanTableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columns.department')}</TableHead>
            <TableHead>{t('columns.fullName')}</TableHead>
            <TableHead>{t('columns.reportStatus')}</TableHead>
            <TableHead>{t('columns.contractEnd')}</TableHead>
            <TableHead>{t('columns.reportSheetCount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-pre-wrap">{row.department}</TableCell>
              <TableCell className="whitespace-pre-wrap">
                <Link
                  className="underline"
                  href={getZamdekanReportPath({
                    view: ZamdekanView.EmployeeLoad,
                    departmentId,
                    employeeId: row.employeeId,
                  })}
                >
                  {row.fullName}
                </Link>
              </TableCell>
              <TableCell className="whitespace-pre-wrap">{row.status}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.contractEnd}</TableCell>
              <TableCell className="whitespace-pre-wrap">{row.sheetCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ZamdekanTableCard>
  );
};
