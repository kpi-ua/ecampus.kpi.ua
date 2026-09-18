'use client';

import { useTranslations } from 'next-intl';

import { Heading2, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VoteData, VoteLecturer, VoteLecturerResult } from '@/types/models/vote';
import { formatNumber } from '@/lib/utils';

interface Props {
  voteData: VoteData;
}

interface ResultLecturer extends VoteLecturer {
  result: VoteLecturerResult;
}

export const VoteResultsTable = ({ voteData }: Props) => {
  const t = useTranslations('private.vote.results');
  const resultLecturers = voteData.lecturers.filter((lecturer): lecturer is ResultLecturer => lecturer.result !== null);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_12px_rgba(158,182,201,0.25)]">
      <div className="mb-6">
        <Heading2 className="leading-lg lg:leading-lg text-lg text-neutral-800 lg:text-lg">
          {voteData.term
            ? t('title', { number: voteData.term.number, studyYear: voteData.term.studyYear })
            : t('heading')}
        </Heading2>
      </div>

      {resultLecturers.length > 0 && (
        <Table className="min-w-[1100px] [&_th]:h-auto [&_th]:py-4 [&_th]:text-xs [&_th]:leading-4 [&_th]:font-medium">
          <TableHeader className="[&_tr]:border-0">
            <TableRow>
              <TableHead scope="col" className="w-[18%] min-w-56">
                {t('lecturer')}
              </TableHead>
              <TableHead scope="col" className="min-w-32">
                <span>
                  {t('overallScore')}
                  <br />
                  {t('universityScore')}
                </span>
              </TableHead>
              <TableHead scope="col" className="min-w-32">
                <span>
                  {t('overallScore')}
                  <br />
                  {t('courseScore')}
                </span>
              </TableHead>
              {voteData.criteria.map((criterion) => (
                <TableHead key={criterion.id} scope="col" className="max-w-64 min-w-32">
                  {criterion.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultLecturers.map((lecturer) => (
              <TableRow key={lecturer.employeeId} className="border-0 even:bg-neutral-50">
                <TableCell className="text-neutral-900">{lecturer.fullName}</TableCell>
                <TableCell className="text-basic-blue font-semibold">
                  {formatNumber(lecturer.result.overallScore)}
                </TableCell>
                <TableCell className="text-basic-blue font-semibold">
                  {lecturer.result.courseScore === null ? '—' : formatNumber(lecturer.result.courseScore)}
                </TableCell>
                {voteData.criteria.map((criterion) => (
                  <TableCell key={criterion.id}>
                    {formatNumber(lecturer.result.criterionScores[criterion.id])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {resultLecturers.length === 0 && (
        <div className="flex min-h-52 flex-col items-center justify-center gap-2 px-4 py-12 text-center" role="status">
          <Paragraph className="m-0 text-lg leading-7 font-semibold text-neutral-500">{t('empty')}</Paragraph>
          <Paragraph className="m-0 max-w-md text-base text-neutral-500">{t('emptyDescription')}</Paragraph>
        </div>
      )}
    </section>
  );
};
