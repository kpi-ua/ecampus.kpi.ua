'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Heading1, Heading6 } from '@/components/typography/headers';
import { SubLayout } from '../../../sub-layout';
import { useTranslations } from 'next-intl';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { Sheet } from '@/types/models/current-control/sheet';
import { getMonitoring } from '@/actions/monitoring.actions';
import SpinnerGap from '@/app/images/icons/SpinnerGap.svg';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { DisciplinesTable } from '@/app/[locale]/(private)/module/studysheet/components/disciplines-table';
import { StudySheetFilters } from '@/app/[locale]/(private)/module/studysheet/components/study-sheet-filters';
import { Semester } from '@/types/enums/current-control/semester';

export function StudySheet() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations('private.study-sheet');

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { errorToast } = useServerErrorToast();

  const studyYears = sheet?.studyYears ?? [];
  const currentYear = studyYears.length > 0 ? studyYears[studyYears.length - 1] : '';

  const selectedStudyYear = searchParams.get('studyYear') || currentYear;
  const selectedSemester = searchParams.get('semester') || Semester.All;

  const fetchData = useCallback(async () => {
    try {
      const data = await getMonitoring();
      setSheet(data);
    } catch (error) {
      errorToast();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let updated = false;

    if (!params.get('studyYear')) {
      params.set('studyYear', currentYear);
      updated = true;
    }
    if (!params.get('semester')) {
      params.set('semester', Semester.All);
      updated = true;
    }
    if (updated) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, currentYear, pathname, router]);

  const filteredDisciplines = useMemo(() => {
    const disciplines = sheet?.disciplines ?? [];

    return disciplines.filter((discipline) => {
      const matchesSemester = selectedSemester === Semester.All || discipline.semester.toString() === selectedSemester;
      const matchesStudyYear = !selectedStudyYear || discipline.studyYear === selectedStudyYear;
      return matchesSemester && matchesStudyYear;
    });
  }, [selectedSemester, selectedStudyYear, sheet?.disciplines]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerGap />
      </div>
    );
  }

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <Heading6 className="mr-auto text-neutral-900">{t('your-information')}</Heading6>
            <StudySheetFilters
              selectedSemester={selectedSemester}
              selectedStudyYear={selectedStudyYear}
              studyYears={studyYears}
              currentYear={currentYear}
            />
          </div>
          <DisciplinesTable
            disciplines={filteredDisciplines}
            selectedStudyYear={selectedStudyYear}
            selectedSemester={selectedSemester}
          />
        </Card>
      </div>
    </SubLayout>
  );
}
