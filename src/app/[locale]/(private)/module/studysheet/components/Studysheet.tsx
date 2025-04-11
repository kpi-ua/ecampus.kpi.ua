'use client';
import { Heading1, Heading6 } from '@/components/typography/headers';
import { SubLayout } from '../../../sub-layout';
import { useTranslations } from 'next-intl';
import { Paragraph } from '@/components/typography/paragraph';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { ProfilePicture } from '@/components/ui/profile-picture';
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Sheet } from '@/types/models/current-control/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const INTL_NAMESPACE = 'private.study-sheet';
const MAX_SCORE = 100;

interface Props {
  sheet: Sheet;
}

type Semester = 'all' | '1' | '2';

export function Studysheet({ sheet }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { disciplines, studyYears } = sheet;

  const currentYear = studyYears[studyYears.length - 1];

  const t = useTranslations(INTL_NAMESPACE);
  const tSemester = useTranslations(`${INTL_NAMESPACE}.semester`);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);

  const selectedStudyYear = searchParams.get('studyYear') || currentYear;
  const selectedSemester = (searchParams.get('semester') as Semester) || 'all';

  const filteredDisciplines = useMemo(() => {
    let filtered = disciplines;

    if (selectedSemester !== 'all') {
      filtered = filtered.filter((discipline) => discipline.semester.toString() === selectedSemester);
    }

    if (selectedStudyYear === 'Всі') {
      return disciplines;
    }

    if (selectedStudyYear) {
      filtered = filtered.filter((discipline) => discipline.studyYear === selectedStudyYear);
    }
    return filtered;
  }, [selectedSemester, selectedStudyYear, disciplines]);

  const handleSemesterChange = (value: Semester) => {
    const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    newSearchParams.set('semester', value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Update the query parameter for studyYear.
  const handleStudyYearChange = (value: string) => {
    const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    newSearchParams.set('studyYear', value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-9">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <Paragraph className="text-lg font-semibold text-neutral-700 sm:ml-4">{tSemester('title')}</Paragraph>
              <Tabs
                defaultValue="all"
                value={selectedSemester}
                onValueChange={(value) => handleSemesterChange(value as Semester)}
                className="w-[210px]"
              >
                <TabsList className="p-[2px]" size="small">
                  <TabsTrigger className="w-[55px] md:w-[66px]" value="all">
                    {tSemester('all')}
                  </TabsTrigger>
                  <TabsTrigger className="w-[60px] md:w-[66px]" value="1">
                    {tSemester('first')}
                  </TabsTrigger>
                  <TabsTrigger className="w-[60px] md:w-[66px]" value="2">
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
                      href={`/module/studysheet/${discipline.id}`}
                    >
                      {discipline.name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[158px]">
                    <Badge className="font-semibold text-basic-blue">
                      {discipline.score}/{MAX_SCORE}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[360px]">
                    <div className="flex items-center gap-3">
                      <ProfilePicture size="xs" src={discipline.teachers[0].photo} />
                      <span className="text-sm font-semibold text-basic-black">{discipline.teachers[0].fullName}</span>
                    </div>
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
