import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';
import { K7HtmlPreview } from '@/types/models/k7-form';

import { summaryCellClassName, summaryRowClassName, tableCellClassName, tableHeadClassName } from './table-styles';

interface Props {
  preview: K7HtmlPreview;
}

export const SummaryTable = ({ preview }: Props) => {
  const t = useTranslations('private.k-7.preview');
  const rows = [
    { title: t('summaryRows.educational'), hours: preview.section6.educationalHours },
    { title: t('sections.scientific'), hours: preview.section6.scientificHours },
    { title: t('sections.methodical'), hours: preview.section6.methodicalHours },
    { title: t('sections.organizational'), hours: preview.section6.organizationalHours },
    { title: t('sections.otherDuties'), hours: preview.section6.otherHours },
  ];

  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className={tableHeadClassName}>{t('table.workType')}</TableHead>
          <TableHead className={`${tableHeadClassName} text-right [&>span]:justify-end`}>{t('table.hours')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.title} className="hover:bg-white">
            <TableCell className={tableCellClassName}>{row.title}</TableCell>
            <TableCell className={`${tableCellClassName} text-right`}>{formatNumber(row.hours, 2)}</TableCell>
          </TableRow>
        ))}
        <TableRow className={summaryRowClassName}>
          <TableCell className={summaryCellClassName}>{t('summaryRows.total')}</TableCell>
          <TableCell className={`${summaryCellClassName} text-right`}>
            {formatNumber(preview.section6.totalHours, 2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
