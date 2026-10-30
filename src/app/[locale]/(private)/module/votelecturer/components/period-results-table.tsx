'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useId, useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { cn, formatNumber } from '@/lib/utils';
import { VoteLecturerData } from '@/types/models/vote/lecturer';

interface Props {
  period: VoteLecturerData;
  latest: boolean;
}

const scoreClassName =
  'inline-flex min-w-11 justify-center rounded-md border border-neutral-400 px-2 py-1 text-sm text-neutral-700';

export const PeriodResultsTable = ({ period, latest }: Props) => {
  const t = useTranslations('private.votelecturer.results');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const detailsId = useId();
  const { term, result, criteria } = period;
  const courses = result?.courses.toSorted((a, b) => a.course - b.course) ?? [];
  const courseRows = courses.length > 0 ? courses : [null];
  const periodTitle = term ? t('period', { number: term.number, studyYear: term.studyYear }) : t('unknownPeriod');

  return (
    <>
      {courseRows.map((course) => {
        const courseKey = course ? String(course.course) : 'empty';
        const expanded = expandedCourse === courseKey;
        const courseDetailsId = `${detailsId}-${courseKey}`;

        return (
          <Fragment key={courseKey}>
            <TableRow className={cn('border-0', latest && 'font-semibold')}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {periodTitle}
                  <Show when={latest}>
                    <span className="sr-only">{t('latest')}</span>
                  </Show>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Show when={!!course} fallback={EMPTY_VALUE}>
                  {t('courseNumber', { number: course?.course ?? 0 })}
                </Show>
              </TableCell>
              <TableCell className="text-center">
                <Show when={!!result} fallback={EMPTY_VALUE}>
                  <span className={scoreClassName}>{formatNumber(result?.overallScore ?? 0)}</span>
                </Show>
              </TableCell>
              <TableCell className="text-center">
                <Show when={!!course} fallback={EMPTY_VALUE}>
                  <span className={scoreClassName}>{formatNumber(course?.score ?? 0)}</span>
                </Show>
              </TableCell>
              <TableCell className="text-center">{course?.respondentCount ?? 0}</TableCell>
              <TableCell className="w-12 px-2">
                <Button variant="tertiary" size="small" onClick={() => setExpandedCourse(expanded ? null : courseKey)}>
                  {expanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </TableCell>
            </TableRow>
            <Show when={expanded}>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell colSpan={6} className="px-0 pt-0 pb-3">
                  <div id={courseDetailsId} className="rounded-[12px] bg-neutral-50 p-4">
                    <Show
                      when={!!result && !!course}
                      fallback={
                        <div className="py-7 text-center">
                          <Paragraph className="m-0 text-base text-neutral-600">{t('empty')}</Paragraph>
                          <Paragraph className="mt-2 mb-0 text-sm text-neutral-500">{t('emptyDescription')}</Paragraph>
                        </div>
                      }
                    >
                      <Table className="[&_td]:py-3 [&_th]:h-auto [&_th]:bg-transparent [&_th]:py-2 [&_th]:text-xs [&_th]:font-medium">
                        <TableHeader>
                          <TableRow className="border-0 bg-transparent">
                            <TableHead scope="col" className="w-[55%]">
                              {t('criterion')}
                            </TableHead>
                            <TableHead scope="col" className="text-center [&>span]:justify-center">
                              {t('coefficientHeading')}
                            </TableHead>
                            <TableHead scope="col" className="w-[24%]">
                              {t('rating')}
                            </TableHead>
                            <TableHead scope="col" className="text-center [&>span]:justify-center">
                              {t('score')}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {criteria.map((criterion) => {
                            const score = course?.criterionScores[criterion.id];
                            return (
                              <TableRow key={criterion.id} className="border-0 bg-transparent">
                                <TableCell>{criterion.name}</TableCell>
                                <TableCell className="text-center">{formatNumber(criterion.coefficient, 1)}</TableCell>
                                <TableCell>
                                  {score != null ? (
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                                      <div
                                        className="h-full rounded-full bg-basic-blue"
                                        style={{ width: String(Math.max(0, Math.min(5, score)) * 20) + '%' }}
                                      />
                                    </div>
                                  ) : (
                                    EMPTY_VALUE
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {score == null ? (
                                    EMPTY_VALUE
                                  ) : (
                                    <span className={scoreClassName}>{formatNumber(score)}</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Show>
                  </div>
                </TableCell>
              </TableRow>
            </Show>
          </Fragment>
        );
      })}
    </>
  );
};
