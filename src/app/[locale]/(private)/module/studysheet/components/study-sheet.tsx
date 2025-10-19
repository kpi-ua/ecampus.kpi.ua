'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Description, Heading2, Heading6 } from '@/components/typography';
import { SubLayout } from '../../../sub-layout';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Sheet } from '@/types/models/current-control/sheet';
import { getMonitoring } from '@/actions/monitoring.actions';
import SpinnerGap from '@/app/images/icons/SpinnerGap.svg';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { DisciplinesTable } from '@/app/[locale]/(private)/module/studysheet/components/disciplines-table';
import { StudySheetFilters } from '@/app/[locale]/(private)/module/studysheet/components/study-sheet-filters';
import { Semester } from '@/types/enums/current-control/semester';
import { useLocalStorage } from '@/hooks/use-storage';

export function StudySheet() {
  const t = useTranslations('private.study-sheet');
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { errorToast } = useServerErrorToast();

  const studyYears = sheet?.studyYears ?? [];
  const currentYear = studyYears.at(-1) || '';

  const [selectedStudyYear = currentYear, setSelectedStudyYear] = useLocalStorage<string>('studyYear');
  const [selectedSemester = Semester.All, setSelectedSemester] = useLocalStorage<Semester>('semester');

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

  const filteredDisciplines = useMemo(() => {
    const disciplines = sheet?.disciplines ?? [];
    return disciplines.filter((discipline) => {
      const matchesSemester = selectedSemester === Semester.All || discipline.semester.toString() === selectedSemester;
      const matchesStudyYear = !selectedStudyYear || discipline.studyYear === selectedStudyYear;
      return matchesSemester && matchesStudyYear;
    });
  }, [selectedSemester, selectedStudyYear, sheet?.disciplines]);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-8">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <SpinnerGap />
          </div>
        ) : (
          <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <Heading6 className="mr-auto text-neutral-900">{t('your-information')}</Heading6>
              <StudySheetFilters
                studyYears={studyYears}
                currentYear={currentYear}
                selectedSemester={selectedSemester}
                selectedStudyYear={selectedStudyYear}
                onStudyYearSelect={setSelectedStudyYear}
                onSemesterSelect={setSelectedSemester}
              />
            </div>
            <DisciplinesTable disciplines={filteredDisciplines} />
          </Card>
        )}
      </div>
    </SubLayout>
  );
}
