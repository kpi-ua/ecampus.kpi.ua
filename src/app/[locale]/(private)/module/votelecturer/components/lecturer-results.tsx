'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Heading2, Paragraph } from '@/components/typography';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Show } from '@/components/utils/show';
import { LecturerVoteResults } from '@/types/models/vote/lecturer';

import { PeriodResultsTable } from './period-results-table';

interface Props {
  results: LecturerVoteResults;
}

export const LecturerResults = ({ results }: Props) => {
  const t = useTranslations('private.votelecturer');
  const [studyYear, setStudyYear] = useState('all');
  const [periodNumber, setPeriodNumber] = useState('all');
  const { periods, studyYears, periodNumbers } = results;
  const filteredPeriods = periods.filter(
    ({ term }) =>
      (studyYear === 'all' || term?.studyYear === studyYear) &&
      (periodNumber === 'all' || String(term?.number) === periodNumber),
  );

  return (
    <section className="min-w-0 rounded-3xl bg-white p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Heading2 className="leading-xl lg:leading-xl m-0 text-2xl lg:text-2xl">{t('heading')}</Heading2>
        {periods.length > 0 && (
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Label htmlFor="vote-study-year">{t('filter.label')}</Label>
              <Select value={studyYear} onValueChange={setStudyYear}>
                <SelectTrigger id="vote-study-year" variant="small" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filter.all')}</SelectItem>
                  {studyYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Label>{t('filter.period')}</Label>
              <Tabs value={periodNumber} onValueChange={setPeriodNumber}>
                <TabsList size="small">
                  <TabsTrigger value="all">{t('filter.allPeriods')}</TabsTrigger>
                  {periodNumbers.map((number) => (
                    <TabsTrigger key={number} value={String(number)}>
                      {number}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}
      </div>
      <Show
        when={filteredPeriods.length > 0}
        fallback={<Paragraph className="text-muted-foreground my-0 py-12 text-center text-sm">{t('empty')}</Paragraph>}
      >
        <Table className="min-w-[760px] [&_th]:h-10 [&_th]:py-3 [&_th]:text-xs [&_th]:font-medium">
          <TableHeader>
            <TableRow className="border-0">
              <TableHead scope="col" className="w-[42%]">
                {t('results.periodHeading')}
              </TableHead>
              <TableHead scope="col" className="text-center [&>span]:justify-center">
                {t('results.course')}
              </TableHead>
              <TableHead scope="col" className="text-center [&>span]:justify-center">
                {t('results.universityScore')}
              </TableHead>
              <TableHead scope="col" className="text-center [&>span]:justify-center">
                {t('results.courseScore')}
              </TableHead>
              <TableHead scope="col" className="text-center [&>span]:justify-center">
                {t('results.votes')}
              </TableHead>
              <TableHead scope="col">
                <span className="sr-only">{t('results.details')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeriods.map((period, index) => (
              <PeriodResultsTable key={period.term?.id ?? index} period={period} latest={period === periods[0]} />
            ))}
          </TableBody>
        </Table>
      </Show>
    </section>
  );
};
