'use client';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

import { DeputyDeanSheetMark } from '../types';
import { groupSheetMarks } from '../utils/group-sheet-marks';
import { DeputyDeanTableCard } from './deputy-dean-table-card';
interface Props {
  marks: DeputyDeanSheetMark[];
}
export const DeputyDeanEmployeeSheetMarksTable = ({ marks }: Props) => {
  const t = useTranslations('private.deputy-dean');
  const { students, assessments } = groupSheetMarks(marks);
  if (students.length === 0) {
    return <Paragraph>{t('empty')}</Paragraph>;
  }
  return (
    <DeputyDeanTableCard>
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
    </DeputyDeanTableCard>
  );
};
