import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/lib/utils';
import { K7HtmlPreview } from '@/types/models/k7-form';

import { summaryCellClassName, summaryRowClassName, tableCellClassName, tableHeadClassName } from './table-styles';

interface Props {
  preview: K7HtmlPreview;
}

export const SummaryTable = ({ preview }: Props) => {
  const rows = [
    { title: 'Навчальна робота', hours: preview.section6.educationalHours },
    { title: 'Наукова робота', hours: preview.section6.scientificHours },
    { title: 'Методична робота', hours: preview.section6.methodicalHours },
    { title: 'Організаційна робота', hours: preview.section6.organizationalHours },
    { title: "Інші трудові обов'язки", hours: preview.section6.otherHours },
  ];

  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className={tableHeadClassName}>Вид роботи</TableHead>
          <TableHead className={`${tableHeadClassName} text-right [&>span]:justify-end`}>Годин</TableHead>
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
          <TableCell className={summaryCellClassName}>Загальне навантаження</TableCell>
          <TableCell className={`${summaryCellClassName} text-right`}>
            {formatNumber(preview.section6.totalHours, 2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
