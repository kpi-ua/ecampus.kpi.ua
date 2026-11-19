'use client';

import { useTranslations } from 'next-intl';

import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { DeputyDeanEmployeeDiscipline } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';

interface Props {
  disciplines: DeputyDeanEmployeeDiscipline[];
  departmentId: number;
}
export const DeputyDeanEmployeeDisciplinesTable = ({ disciplines, departmentId }: Props) => {
  const t = useTranslations('private.deputy-dean');

  return (
    <Show when={disciplines.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <DeputyDeanTableCard>
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
                <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
                <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
                <TableCell className="whitespace-pre-wrap">{row.teachingTypes?.split(',').join('\n')}</TableCell>
                <TableCell className="whitespace-pre-wrap">
                  <Link
                    className="underline"
                    href={getDeputyDeanReportPath({
                      view: DeputyDeanView.Sheets,
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
      </DeputyDeanTableCard>
    </Show>
  );
};
