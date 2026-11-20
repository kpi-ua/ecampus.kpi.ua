import { getTranslations } from 'next-intl/server';

import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { DeputyDeanEmployee } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';

interface Props {
  employees: DeputyDeanEmployee[];
  departmentId: number;
}
export const DeputyDeanEmployeesTable = async ({ employees, departmentId }: Props) => {
  const t = await getTranslations('private.deputy-dean');

  return (
    <Show when={employees.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
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
    </Show>
  );
};
