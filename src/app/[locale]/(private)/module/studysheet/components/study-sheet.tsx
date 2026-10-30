'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { getMonitoring } from '@/actions/monitoring.actions';
import { DisciplinesTable } from '@/app/[locale]/(private)/module/studysheet/components/disciplines-table';
import { StudySheetFilters } from '@/app/[locale]/(private)/module/studysheet/components/study-sheet-filters';
import { LoadingScreen } from '@/components/loading-screen';
import { Description, Heading2, Heading6 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useLocalStorage } from '@/hooks/use-storage';
import { Semester } from '@/types/enums/current-control/semester';

import { SubLayout } from '../../../sub-layout';

export function StudySheet() {
  const t = useTranslations('private.study-sheet');
  const { errorToast } = useServerErrorToast();
  const { data: sheet, isPending } = useQuery({
    queryKey: ['monitoring'],
    queryFn: async () => {
      try {
        return await getMonitoring();
      } catch (error) {
        errorToast();
        throw error;
      }
    },
  });

  const studyYears = sheet?.studyYears ?? [];
  const currentYear = studyYears.at(-1) || '';

  const [selectedStudyYear = currentYear, setSelectedStudyYear] = useLocalStorage<string>('studyYear');
  const [selectedSemester = Semester.All, setSelectedSemester] = useLocalStorage<Semester>('semester');

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
        {isPending ? (
          <LoadingScreen />
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
