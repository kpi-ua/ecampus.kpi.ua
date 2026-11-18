'use client';

import { useTranslations } from 'next-intl';

import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { DeputyDeanEmployee } from '../types';
import { getDeputyDeanReportPath } from '../utils/report-path';
import { DeputyDeanTableCard } from './deputy-dean-table-card';

interface Props {
  employees: DeputyDeanEmployee[];
  departmentId: number;
}
export const DeputyDeanEmployeesTable = ({ employees, departmentId }: Props) => {
  const t = useTranslations('private.deputy-dean');

  if (employees.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <DeputyDeanTableCard>
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
                  href={getDeputyDeanReportPath({
                    view: DeputyDeanView.EmployeeLoad,
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
    </DeputyDeanTableCard>
  );
};
