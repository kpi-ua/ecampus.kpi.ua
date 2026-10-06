'use client';

import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';

import { ZamdekanDepartmentIndicators } from '../types';
import { getZamdekanReportPath } from '../utils/report-path';

interface Props {
  departments: ZamdekanDepartmentIndicators[];
}

export const ZamdekanCathedrasTable = ({ departments }: Props) => {
  const t = useTranslations('private.zamdekan');
  if (departments.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('columns.faculty')}</TableHead>
          <TableHead>{t('columns.department')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => (
          <TableRow key={department.departmentId}>
            <TableCell>{department.faculty}</TableCell>
            <TableCell>
              <Link
                href={getZamdekanReportPath({ view: 'statistics-other', cathedraId: department.departmentId })}
                className="underline"
              >
                {department.department}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
