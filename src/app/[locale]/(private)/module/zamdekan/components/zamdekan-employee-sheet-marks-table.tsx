'use client';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

import { ZamdekanSheetMark } from '../types';
import { groupSheetMarks } from '../utils/group-sheet-marks';
import { ZamdekanTableCard } from './zamdekan-table-card';
interface Props {
  marks: ZamdekanSheetMark[];
}
export const ZamdekanEmployeeSheetMarksTable = ({ marks }: Props) => {
  const t = useTranslations('private.zamdekan');
  const { students, assessments } = groupSheetMarks(marks);
  if (students.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <ZamdekanTableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columns.student')}</TableHead>
            {assessments.map((assessment) => (
              <TableHead key={assessment.key}>{assessment.date ? formatDate(assessment.date) : ''}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>{student.student}</TableCell>
              {assessments.map((assessment) => (
                <TableCell key={assessment.key}>{student.marks[assessment.key] ?? ''}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ZamdekanTableCard>
  );
};
