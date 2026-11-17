'use client';

import { useTranslations } from 'next-intl';
import { group } from 'radash';
import { useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { useTableSort } from '@/hooks/use-table-sort';

import { AttestationReportGroup, AttestationReportQuery } from '../types';
import { ReportExportButton } from './report-export-button';

interface Props {
  groups: AttestationReportGroup[];
  query: AttestationReportQuery;
}

interface CourseRow {
  course: number;
  name: string;
  curator: string;
  details: string;
}

const columns = [
  { key: 'course', label: 'course' },
  { key: 'name', label: 'group' },
  { key: 'curator', label: 'curator' },
  { key: 'details', label: 'details' },
] as const;

export const ReportCoursesTable = ({ groups, query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const [filters, setFilters] = useState<Partial<Record<keyof CourseRow, string>>>({});
  const rows: CourseRow[] = Object.entries(group(groups, (item) => item.course)).map(([course, items = []]) => ({
    course: Number(course),
    name: items.map((item) => item.name).join(', '),
    curator: [...new Set(items.map((item) => item.curator).filter(Boolean))].join(', '),
    details: [...new Set(items.map((item) => item.details))].join('; '),
  }));
  const filteredRows = rows.filter((row) =>
    columns.every(({ key }) =>
      String(row[key])
        .toLocaleLowerCase()
        .includes((filters[key] ?? '').trim().toLocaleLowerCase()),
    ),
  );
  const { sortedRows, sortHandlers } = useTableSort(filteredRows, undefined, ['course', 'name', 'curator', 'details']);
  return (
    <Show when={rows.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(({ key, label }) => (
              <TableHead key={key} sortHandlers={sortHandlers} sortHeader={key}>
                {t(label)}
              </TableHead>
            ))}
            <TableHead>{t('results')}</TableHead>
          </TableRow>
          <TableRow>
            {columns.map(({ key, label }) => (
              <TableCell key={key}>
                <Input
                  aria-label={t(label)}
                  placeholder={t(label)}
                  value={filters[key] ?? ''}
                  onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
                />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.course}>
              {columns.map(({ key }) => (
                <TableCell key={key}>{row[key]}</TableCell>
              ))}
              <TableCell>
                <ReportExportButton query={{ ...query, course: row.course }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Show>
  );
};
