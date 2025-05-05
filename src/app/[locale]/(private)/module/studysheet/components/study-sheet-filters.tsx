'use client';

import React from 'react';
import { Paragraph } from '@/components/typography/paragraph';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Semester } from '@/types/enums/current-control/semester';

interface Props {
  selectedSemester?: Semester;
  selectedStudyYear?: string;
  currentYear: string;
  studyYears: string[];
  setSelectedStudyYear: (value?: string) => void;
  setSelectedSemester: (value?: Semester) => void;
}

export function StudySheetFilters({ currentYear, studyYears, selectedSemester, selectedStudyYear, setSelectedStudyYear, setSelectedSemester }: Props) {
  const t = useTranslations('private.study-sheet');
  const tSemester = useTranslations('private.study-sheet.semester');

  return (
    <>
      <div className="flex items-center">
        <Paragraph className="mr-5 text-lg font-semibold text-neutral-700">{t('study-year')}</Paragraph>
        <Select value={selectedStudyYear} onValueChange={setSelectedStudyYear}>
          <SelectTrigger className="h-[36px] w-[132px]">
            <SelectValue placeholder={currentYear} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {studyYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <Paragraph className="text-lg font-semibold text-neutral-700 lg:ml-4">{tSemester('title')}</Paragraph>
        <Tabs
          defaultValue="all"
          value={selectedSemester}
          onValueChange={(value) => setSelectedSemester(value as Semester)}
          className="w-[210px]"
        >
          <TabsList className="p-[2px]" size="small">
            <TabsTrigger className="w-[55px] md:w-[66px]" value={Semester.All}>
              {tSemester('all')}
            </TabsTrigger>
            <TabsTrigger className="w-[60px] md:w-[66px]" value={Semester.First}>
              {tSemester('first')}
            </TabsTrigger>
            <TabsTrigger className="w-[60px] md:w-[66px]" value={Semester.Second}>
              {tSemester('second')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
