'use client';

import { useTranslations } from 'next-intl';
import qs from 'query-string';
import { group } from 'radash';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { Link } from '@/i18n/routing';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';

import { ATTESTATION_RESULTS_PATH, AttestationReportView } from '../constants';
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
  const { sortedRows, sortHandlers } = useTableSort(rows, undefined, [
    'course',
    'name',
    'curator',
    'details',
    'fullName',
  ]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);
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
                  <Link
                    className="underline"
                    href={qs.stringifyUrl({
                      url: `${ATTESTATION_RESULTS_PATH}/report`,
                      query: { ...query, ...row.target },
                    })}
                  >
                    {t('open')}
                  </Link>
                  <ReportExportButton query={{ ...query, ...row.target }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Show when={rows.length > PAGE_SIZE_DEFAULT}>
          <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={rows.length} />
        </Show>
      </div>
    </Show>
  );
};
