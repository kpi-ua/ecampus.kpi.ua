'use client';

import { useTranslations } from 'next-intl';
import { objectify, listify, sift, unique } from 'radash';
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

interface DepartmentRow {
  course: string;
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

export const ReportDepartmentTable = ({ groups, query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const [filters, setFilters] = useState(() =>
    objectify(
      columns,
      ({ key }) => key,
      () => '',
    ),
  );
  const rows: DepartmentRow[] = groups.length
    ? [
        {
          course: t('all-courses'),
          name: groups.map((item) => item.name).join(', '),
          curator: unique(sift(groups.map((item) => item.curator))).join(', '),
          details: unique(groups.map((item) => item.details)).join('; '),
        },
      ]
    : [];
  const filteredRows = rows.filter((row) =>
    listify(filters, (key, value) =>
      String(row[key])
        .toLocaleLowerCase()
        .includes((value ?? '').trim().toLocaleLowerCase()),
    ).every(Boolean),
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
            <TableRow key={row.name}>
              {columns.map(({ key }) => (
                <TableCell key={key}>{row[key]}</TableCell>
              ))}
              <TableCell>
                <ReportExportButton query={query} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Show>
  );
};
