import { Paragraph } from '@/components/typography/paragraph';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Semester } from '@/types/enums/current-control/semester';

interface Props {
  selectedSemester: string;
  selectedStudyYear: string;
  currentYear: string;
  studyYears: string[];
}

export function StudySheetFilters({ selectedSemester, selectedStudyYear, currentYear, studyYears }: Props) {
  const t = useTranslations('private.study-sheet');
  const tSemester = useTranslations('private.study-sheet.semester');

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createParamHandler = (param: string) => (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(param, value);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSemesterChange = createParamHandler('semester');
  const handleStudyYearChange = createParamHandler('studyYear');

  return (
    <>
      <div className="flex items-center">
        <Paragraph className="mr-5 text-lg font-semibold text-neutral-700">{t('study-year')}</Paragraph>
        <Select value={selectedStudyYear} onValueChange={handleStudyYearChange}>
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
        <Tabs defaultValue="all" value={selectedSemester} onValueChange={handleSemesterChange} className="w-[210px]">
          <TabsList className="p-[2px]" size="small">
            <TabsTrigger className="w-[55px] md:w-[66px]" value={Semester.ALL}>
              {tSemester('all')}
            </TabsTrigger>
            <TabsTrigger className="w-[60px] md:w-[66px]" value={Semester.FIRST}>
              {tSemester('first')}
            </TabsTrigger>
            <TabsTrigger className="w-[60px] md:w-[66px]" value={Semester.SECOND}>
              {tSemester('second')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
