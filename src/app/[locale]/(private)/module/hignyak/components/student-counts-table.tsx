import { getTranslations } from 'next-intl/server';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { type DnvrAttestationReport, type DnvrStudentCount } from '@/types/models/dnvr-reporting';

export async function StudentCountsTable({
  rows,
  report,
  period,
  detail,
}: {
  rows: DnvrStudentCount[];
  report: DnvrAttestationReport | null;
  period: string;
  detail: boolean;
}) {
  const t = await getTranslations('private.dnvr-reporting');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('faculty')}</TableHead>
          <TableHead>{t('course')}</TableHead>
          <TableHead>{t('educationLevel')}</TableHead>
          <TableHead>{t(detail ? 'disciplineAndGroup' : 'students')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={4}>{t('empty')}</TableCell>
          </TableRow>
        )}
        {rows.map((row) => (
          <TableRow
            key={JSON.stringify([
              row.faculty,
              row.facultyAbbreviation,
              row.course,
              row.educationLevel,
              row.disciplineAndGroup,
            ])}
          >
            <TableCell>{row.facultyAbbreviation || row.faculty}</TableCell>
            <TableCell>{row.course}</TableCell>
            <TableCell>{row.educationLevel}</TableCell>
            <TableCell>
              {detail ? (
                row.disciplineAndGroup
              ) : row.facultyId && row.educationLevelId && report ? (
                <Link
                  className="underline"
                  href={{
                    pathname: '/module/hignyak',
                    query: {
                      report,
                      period,
                      facultyId: row.facultyId,
                      educationLevelId: row.educationLevelId,
                      course: row.course,
                    },
                  }}
                >
                  {row.studentCount}
                </Link>
              ) : (
                row.studentCount
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
