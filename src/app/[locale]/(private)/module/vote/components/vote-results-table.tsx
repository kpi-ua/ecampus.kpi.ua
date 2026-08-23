'use client';

import { useTranslations } from 'next-intl';

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

  if (!voteData.term || resultLecturers.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</p>;
  }

  return (
    <section className="space-y-5">
      <div className="text-center">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 sm:text-2xl">
          {t('title', { number: voteData.term.number, studyYear: voteData.term.studyYear })}
        </h2>
        {voteData.term.description && <p className="mt-2 text-sm text-neutral-600">{voteData.term.description}</p>}
      </div>

      <Table className="min-w-max border border-neutral-200">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="min-w-56">
              {t('lecturer')}
            </TableHead>
            <TableHead colSpan={2} className="text-center [&>span]:justify-center">
              {t('overallScore')}
            </TableHead>
            {voteData.criteria.map((criterion) => (
              <TableHead
                key={criterion.id}
                rowSpan={2}
                className="max-w-52 min-w-40 text-center normal-case [&>span]:justify-center"
              >
                {criterion.name}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            <TableHead className="min-w-28 text-center normal-case [&>span]:justify-center">
              {t('universityScore')}
            </TableHead>
            <TableHead className="min-w-24 text-center normal-case [&>span]:justify-center">
              {t('courseScore')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultLecturers.map((lecturer) => (
            <TableRow key={lecturer.employeeId}>
              <TableCell className="font-medium text-neutral-900">{lecturer.fullName}</TableCell>
              <TableCell className="border-l border-neutral-200 text-center font-semibold text-red-500">
                {formatNumber(lecturer.result.overallScore)}
              </TableCell>
              <TableCell className="border-r border-neutral-200 text-center font-semibold text-red-500">
                {lecturer.result.courseScore === null ? '—' : formatNumber(lecturer.result.courseScore)}
              </TableCell>
              {voteData.criteria.map((criterion) => (
                <TableCell key={criterion.id} className="text-center">
                  {formatNumber(lecturer.result.criterionScores[criterion.id])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
