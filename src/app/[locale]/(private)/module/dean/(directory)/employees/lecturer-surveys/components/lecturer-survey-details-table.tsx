import { getLocale, getTranslations } from 'next-intl/server';

import { Heading2 } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatNumber } from '@/lib/utils';
import { type LecturerSurvey } from '@/types/models/dean';

export async function LecturerSurveyDetailsTable({
  details,
  lecturer,
}: {
  details: LecturerSurvey[];
  lecturer: string;
}) {
  const t = await getTranslations('private.dean');
  const locale = await getLocale();
  const score = (value: number | null) => (value === null ? EMPTY_VALUE : formatNumber(value, 2, locale));
  return (
    <div className="pt-4">
      <Heading2 className="mb-4 text-xl leading-7 lg:text-xl lg:leading-7">{lecturer}</Heading2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('studyYear')}</TableHead>
            <TableHead>{t('survey')}</TableHead>
            <TableHead>{t('course')}</TableHead>
            <TableHead>{t('criterion')}</TableHead>
            <TableHead>{t('responses')}</TableHead>
            <TableHead>{t('average')}</TableHead>
            <TableHead>{t('weightedAverage')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={details.length > 0} fallback={<TableEmptyRow colSpan={7}>{t('empty')}</TableEmptyRow>}>
            {details.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.studyYear ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.survey ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.course ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.criterion ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.responses ?? EMPTY_VALUE}</TableCell>
                <TableCell>{score(row.average)}</TableCell>
                <TableCell>{score(row.weightedAverage)}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </div>
  );
}
