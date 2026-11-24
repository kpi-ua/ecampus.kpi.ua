import { getTranslations } from 'next-intl/server';

import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { type StudentSurvey } from '@/types/models/dean';

export async function StudentSurveyTable({ surveys }: { surveys: StudentSurvey[] }) {
  const t = await getTranslations('private.dean');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('studyYear')}</TableHead>
          <TableHead>{t('survey')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
          <TableHead>{t('date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Show when={surveys.length > 0} fallback={<TableEmptyRow colSpan={4}>{t('empty')}</TableEmptyRow>}>
          {surveys.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.studyYear ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.survey ?? EMPTY_VALUE}</TableCell>
              <TableCell>{row.lecturer ?? EMPTY_VALUE}</TableCell>
              <TableCell>{formatDate(row.submittedAt) || EMPTY_VALUE}</TableCell>
            </TableRow>
          ))}
        </Show>
      </TableBody>
    </Table>
  );
}
