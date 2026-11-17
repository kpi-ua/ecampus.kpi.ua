'use client';

import { useTranslations } from 'next-intl';
import { group } from 'radash';
import { useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';

import { AttestationReportView } from '../constants';
import { AttestationReportGroup, AttestationReportQuery, AttestationReportStudent } from '../types';
import { ReportExportButton } from './report-export-button';

interface Props {
  groups: AttestationReportGroup[];
  students: AttestationReportStudent[];
  view: AttestationReportView;
  query: AttestationReportQuery;
}

interface DirectoryRow extends AttestationReportGroup {
  fullName: string;
  key: string;
  target: Pick<Partial<AttestationReportQuery>, 'groupId' | 'studentId' | 'course'>;
}

export const ReportDirectoryTable = ({ groups, students, view, query }: Props) => {
  const t = useTranslations('private.attestation-reports');
  const [filters, setFilters] = useState<Partial<Record<keyof DirectoryRow, string>>>({});
  const groupMap = new Map(groups.map((g) => [g.id, g]));
  const rows: DirectoryRow[] =
    view === AttestationReportView.Students
      ? students.map((student) => ({
          ...groupMap.get(student.groupId)!,
          fullName: student.fullName,
          key: String(student.studentId),
          target: { studentId: student.studentId },
        }))
      : view === AttestationReportView.Groups
        ? groups.map((group) => ({ ...group, fullName: '', key: String(group.id), target: { groupId: group.id } }))
        : Object.entries(group(groups, (item) => (view === AttestationReportView.Courses ? item.course : 0))).map(
            ([course, items = []]) => ({
              id: Number(course),
              course: Number(course),
              name: items.map((g) => g.name).join(', '),
              curator: [...new Set(items.map((g) => g.curator).filter(Boolean))].join(', '),
              details: [...new Set(items.map((g) => g.details))].join('; '),
              fullName: '',
              key: String(course),
              target: view === AttestationReportView.Courses ? { course: Number(course) } : {},
            }),
          );
  const filteredRows = rows.filter((row) =>
    Object.entries(filters).every(([key, value]) =>
      String(row[key as keyof DirectoryRow] ?? '')
        .toLocaleLowerCase()
        .includes(value.trim().toLocaleLowerCase()),
    ),
  );
  const { sortedRows, sortHandlers } = useTableSort(filteredRows, undefined, [
    'course',
    'name',
    'curator',
    'details',
    'fullName',
  ]);
  const pageSearchParam = `${view}Page`;
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows, pageSearchParam);
  return (
    <Show when={rows.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <Show when={view === AttestationReportView.Students}>
                <TableHead sortHandlers={sortHandlers} sortHeader="fullName">
                  {t('student')}
                </TableHead>
              </Show>
              <TableHead sortHandlers={sortHandlers} sortHeader="course">
                {t('course')}
              </TableHead>
              <TableHead sortHandlers={sortHandlers} sortHeader="name">
                {t('group')}
              </TableHead>
              <TableHead sortHandlers={sortHandlers} sortHeader="curator">
                {t('curator')}
              </TableHead>
              <TableHead sortHandlers={sortHandlers} sortHeader="details">
                {t('details')}
              </TableHead>
              <TableHead>{t('results')}</TableHead>
            </TableRow>
            <TableRow>
              <Show when={view === AttestationReportView.Students}>
                <TableCell>
                  <Input
                    aria-label={t('student')}
                    placeholder={t('student')}
                    value={filters.fullName ?? ''}
                    onChange={(event) => setFilters((current) => ({ ...current, fullName: event.target.value }))}
                  />
                </TableCell>
              </Show>
              <TableCell>
                <Input
                  aria-label={t('course')}
                  placeholder={t('course')}
                  value={filters.course ?? ''}
                  onChange={(event) => setFilters((current) => ({ ...current, course: event.target.value }))}
                />
              </TableCell>
              <TableCell>
                <Input
                  aria-label={t('group')}
                  placeholder={t('group')}
                  value={filters.name ?? ''}
                  onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
                />
              </TableCell>
              <TableCell>
                <Input
                  aria-label={t('curator')}
                  placeholder={t('curator')}
                  value={filters.curator ?? ''}
                  onChange={(event) => setFilters((current) => ({ ...current, curator: event.target.value }))}
                />
              </TableCell>
              <TableCell>
                <Input
                  aria-label={t('details')}
                  placeholder={t('details')}
                  value={filters.details ?? ''}
                  onChange={(event) => setFilters((current) => ({ ...current, details: event.target.value }))}
                />
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((row) => (
              <TableRow key={row.key}>
                <Show when={view === AttestationReportView.Students}>
                  <TableCell>{row.fullName}</TableCell>
                </Show>
                <TableCell>{view === AttestationReportView.Department ? t('all-courses') : row.course}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.curator}</TableCell>
                <TableCell>{row.details}</TableCell>
                <TableCell>
                  <ReportExportButton query={{ ...query, ...row.target }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Show when={filteredRows.length > PAGE_SIZE_DEFAULT}>
          <PaginationWithLinks
            page={page}
            pageSize={PAGE_SIZE_DEFAULT}
            totalCount={filteredRows.length}
            pageSearchParam={pageSearchParam}
          />
        </Show>
      </div>
    </Show>
  );
};
