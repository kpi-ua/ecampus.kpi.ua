'use client';
import React, { useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Heading1, Heading6 } from '@/components/typography/headers';
import { SubLayout } from '../../../sub-layout';
import { useTranslations } from 'next-intl';
import { Paragraph } from '@/components/typography/paragraph';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet } from '@/types/models/current-control/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INTL_NAMESPACE } from '@/app/[locale]/(private)/module/studysheet/constants';
import { SEMESTER } from './constants';
import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/LecturerItemCell';

const MAX_SCORE = 100;

interface Props {
  sheet: Sheet;
}

export function Studysheet({ sheet }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const querySemester = searchParams.get('semester');
  const queryYear = searchParams.get('studyYear');

  const { disciplines, studyYears } = sheet;
  const currentYear = studyYears[studyYears.length - 1];

  const t = useTranslations(INTL_NAMESPACE);
  const tSemester = useTranslations(`${INTL_NAMESPACE}.semester`);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    let updated = false;

    if (!params.get('studyYear')) {
      params.set('studyYear', currentYear);
      updated = true;
    }
    if (!params.get('semester')) {
      params.set('semester', SEMESTER.ALL);
      updated = true;
    }
    if (updated) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, currentYear, pathname, router]);

  const selectedStudyYear = searchParams.get('studyYear') || currentYear;
  const selectedSemester = (searchParams.get('semester') as SEMESTER) || SEMESTER.ALL;

  const filteredDisciplines = useMemo(() => {
    return disciplines.filter((discipline) => {
      const matchesSemester = selectedSemester === SEMESTER.ALL || discipline.semester.toString() === selectedSemester;
      const matchesStudyYear = !selectedStudyYear || discipline.studyYear === selectedStudyYear;
      return matchesSemester && matchesStudyYear;
    });
  }, [selectedSemester, selectedStudyYear, disciplines]);

  const handleSemesterChange = (value: SEMESTER) => {
    const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    newSearchParams.set('semester', value);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleStudyYearChange = (value: string) => {
    const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    newSearchParams.set('studyYear', value);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-9">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <Heading6 className="mr-auto text-neutral-900">{t('your-information')}</Heading6>
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
              <Tabs
                defaultValue="all"
                value={selectedSemester}
                onValueChange={(value) => handleSemesterChange(value as SEMESTER)}
                className="w-[210px]"
              >
                <TabsList className="p-[2px]" size="small">
                  <TabsTrigger className="w-[55px] md:w-[66px]" value={SEMESTER.ALL}>
                    {tSemester('all')}
                  </TabsTrigger>
                  <TabsTrigger className="w-[60px] md:w-[66px]" value={SEMESTER.FIRST}>
                    {tSemester('first')}
                  </TabsTrigger>
                  <TabsTrigger className="w-[60px] md:w-[66px]" value={SEMESTER.SECOND}>
                    {tSemester('second')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tTable('subject')}</TableHead>
                <TableHead>{tTable('score')}</TableHead>
                <TableHead>{tTable('lecturer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisciplines.map((discipline) => (
                <TableRow key={discipline.id}>
                  <TableCell className="max-w-[336px]">
                    <Link
                      className="text-sm font-medium text-basic-black underline"
                      href={`/module/studysheet/${discipline.id}?studyYear=${queryYear}&semester=${querySemester}`}
                    >
                      {discipline.name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[158px]">
                    <Badge className="font-semibold text-basic-blue">
                      {Number(discipline.score)}/{MAX_SCORE}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex max-w-[360px] flex-col gap-1">
                    {discipline?.lecturers?.map((lecturer, index) => (
                      <LecturerItemCell key={index} photo={lecturer.photo} fullName={lecturer.fullName} />
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </SubLayout>
  );
}
