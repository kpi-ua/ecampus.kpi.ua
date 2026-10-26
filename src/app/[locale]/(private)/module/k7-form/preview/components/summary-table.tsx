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
  // The time norms limit two of these totals, and the generated document marks the trimmed ones
  // with a footnote; the preview shows the same marks so the two cannot look like different reports.
  const scientificCap = preview.caps.scientific;
  const otherDutiesCap = preview.caps.otherDuties;
  const rows = [
    { title: t('summaryRows.educational'), hours: preview.section6.educationalHours, mark: '' },
    {
      title: t('sections.scientific'),
      hours: preview.section6.scientificHours,
      mark: scientificCap && scientificCap.exceededHours > 0 ? '**' : '',
    },
    { title: t('sections.methodical'), hours: preview.section6.methodicalHours, mark: '' },
    { title: t('sections.organizational'), hours: preview.section6.organizationalHours, mark: '' },
    {
      title: t('sections.otherDuties'),
      hours: preview.section6.otherHours,
      mark: otherDutiesCap && otherDutiesCap.exceededHours > 0 ? '*' : '',
    },
  ];
  const notes = [
    otherDutiesCap && otherDutiesCap.exceededHours > 0
      ? t('caps.otherDuties', { hours: formatNumber(otherDutiesCap.creditedHours, 2) })
      : null,
    scientificCap && scientificCap.exceededHours > 0
      ? t('caps.scientific', { hours: formatNumber(scientificCap.creditedHours, 2) })
      : null,
  ].filter((note): note is string => note !== null);

  return (
    <>
      <Table className="leading-xs table-fixed border-collapse text-xs">
        <TableHeader>
          <TableRow className="hover:bg-white">
            <TableHead className={tableHeadClassName}>{t('table.workType')}</TableHead>
            <TableHead className={`${tableHeadClassName} text-right [&>span]:justify-end`}>
              {t('table.hours')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.title} className="hover:bg-white">
              <TableCell className={tableCellClassName}>{row.title}</TableCell>
              <TableCell className={`${tableCellClassName} text-right`}>
                {formatNumber(row.hours, 2)}
                {row.mark}
              </TableCell>
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
      {notes.length > 0 && (
        <ul className="leading-xs mt-2 flex flex-col gap-1 text-xs text-neutral-500">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </>
  );
};
