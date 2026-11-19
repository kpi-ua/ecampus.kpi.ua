import { getTranslations } from 'next-intl/server';
import { group, listify, sift, unique } from 'radash';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

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

export const ReportCoursesTable = async ({ groups, query }: Props) => {
  const t = await getTranslations('private.attestation-reports');
  const rows: CourseRow[] = listify(
    group(groups, (item) => item.course),
    (course, items = []) => ({
      course: Number(course),
      name: items.map((item) => item.name).join(', '),
      curator: unique(sift(items.map((item) => item.curator))).join(', '),
      details: unique(items.map((item) => item.details)).join('; '),
    }),
  );
  return (
    <Show when={rows.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(({ key, label }) => (
              <TableHead key={key} sortHeader={key}>
                {t(label)}
              </TableHead>
            ))}
            <TableHead>{t('results')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
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
