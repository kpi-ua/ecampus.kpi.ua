'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

import { ZamdekanSheetMark } from '../types';
import { formatZamdekanMark } from '../utils/format-mark';
import { groupSheetMarks } from '../utils/group-sheet-marks';

interface Props {
  marks: ZamdekanSheetMark[];
}

export const ZamdekanEmployeeSheetMarksTable = ({ marks }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { students, assessments } = groupSheetMarks(marks);
  const { sortedRows, sortHandlers } = useTableSort(students, undefined, ['student']);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (students.length === 0)
    return <Paragraph className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</Paragraph>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortHandlers={sortHandlers} sortHeader="student">
              {t('columns.student')}
            </TableHead>
            {assessments.map((assessment) => (
              <TableHead key={assessment.key} className="whitespace-pre-wrap">
                {[
                  assessment.description || assessment.sheetName || t('columns.assessment'),
                  assessment.teacher,
                  assessment.date ? dayjs(assessment.date).format('DD.MM.YYYY') : '',
                ]
                  .filter(Boolean)
                  .join('\n')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>{student.student}</TableCell>
              {assessments.map((assessment) => (
                <TableCell key={assessment.key}>{formatZamdekanMark(student.marks[assessment.key], t)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Show when={students.length > PAGE_SIZE_DEFAULT}>
        <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={students.length} />
      </Show>
    </div>
  );
};
