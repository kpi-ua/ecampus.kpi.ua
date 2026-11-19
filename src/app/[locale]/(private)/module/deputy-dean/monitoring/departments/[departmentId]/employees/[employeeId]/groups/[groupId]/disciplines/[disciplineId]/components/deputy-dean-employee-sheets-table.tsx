'use client';

import { useTranslations } from 'next-intl';

import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { DeputyDeanMonitoringSheet } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';

interface Props {
  sheets: DeputyDeanMonitoringSheet[];
  departmentId: number;
  employeeId: number;
}
export const DeputyDeanEmployeeSheetsTable = ({ sheets, departmentId, employeeId }: Props) => {
  const t = useTranslations('private.deputy-dean');

  return (
    <Show when={sheets.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <DeputyDeanTableCard>
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
                    href={getDeputyDeanReportPath({
                      view: DeputyDeanView.Sheet,
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
      </DeputyDeanTableCard>
    </Show>
  );
};
