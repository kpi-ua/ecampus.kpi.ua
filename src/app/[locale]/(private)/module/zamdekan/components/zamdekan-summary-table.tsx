'use client';

import { useTranslations } from 'next-intl';

import { Heading3, Heading4, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ZamdekanCourseIndicators, ZamdekanDepartmentSummary } from '../types';
import { ZamdekanTableCard } from './zamdekan-table-card';

interface Props {
  summary: ZamdekanDepartmentSummary;
  outwardOnly?: boolean;
  departmentId?: number;
}

const metrics = ['groupCount', 'moduleCount', 'sheetCount', 'filledSheetCount'] as const;
const courses = [
  { educationLevel: 'bachelor', count: 4 },
  { educationLevel: 'master', count: 2 },
  { educationLevel: 'phd', count: 2 },
] as const;

export const ZamdekanSummaryTable = ({ summary, outwardOnly = false, departmentId }: Props) => {
  const t = useTranslations('private.zamdekan');
  const departments =
    departmentId === undefined
      ? summary.departments
      : summary.departments.filter((department) => department.departmentId === departmentId);
  if (departments.length === 0) {
    return <Paragraph className="py-12 text-center text-sm text-muted-foreground">{t('empty')}</Paragraph>;
  }

  const renderIndicators = (indicators: ZamdekanCourseIndicators[], title: string) => (
    <div className="space-y-4">
      <Heading4>{title}</Heading4>
      <ZamdekanTableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>{t('summary.indicator')}</TableHead>
              {courses.map((level) => (
                <TableHead key={level.educationLevel} colSpan={level.count}>
                  {t(`summary.${level.educationLevel}`)}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {courses.flatMap((level) =>
                Array.from({ length: level.count }, (_, index) => (
                  <TableHead key={`${level.educationLevel}-${index}`}>{index + 1}</TableHead>
                )),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric}>
                <TableCell>{t(`summary.${metric}`)}</TableCell>
                {courses.flatMap((level) =>
                  Array.from({ length: level.count }, (_, index) => (
                    <TableCell key={`${level.educationLevel}-${index}`} className="text-start tabular-nums">
                      {indicators.find(
                        (item) => item.educationLevel === level.educationLevel && item.course === index + 1,
                      )?.[metric] ?? 0}
                    </TableCell>
                  )),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ZamdekanTableCard>
    </div>
  );

  return (
    <div className="space-y-10">
      {departments.map((department) => (
        <section key={department.departmentId} className="space-y-8">
          <Heading3>
            {department.faculty} — {department.department}
          </Heading3>
          {!outwardOnly && renderIndicators(department.curriculum, t('summary.curriculum'))}
          {renderIndicators(department.outwardTeaching, t('summary.outwardTeaching'))}
        </section>
      ))}
    </div>
  );
};
