import { getTranslations } from 'next-intl/server';

import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanSheetMark } from '@/app/[locale]/(private)/module/deputy-dean/types';
import { groupSheetMarks } from '@/app/[locale]/(private)/module/deputy-dean/utils/group-sheet-marks';
import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
interface Props {
  marks: DeputyDeanSheetMark[];
}
export const DeputyDeanEmployeeSheetMarksTable = async ({ marks }: Props) => {
  const t = await getTranslations('private.deputy-dean');
  const { students, assessments } = groupSheetMarks(marks);
  return (
    <Show when={students.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
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
                  <TableCell key={assessment.key}>{student.marks[assessment.key] ?? EMPTY_VALUE}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DeputyDeanTableCard>
    </Show>
  );
};
