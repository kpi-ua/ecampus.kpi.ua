'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { getK7FormLecturers } from '@/actions/k7-form.actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { K7FormCathedra, K7FormLecturerProfileOption, K7ReportRequest } from '@/types/models/k7-form';

import { useK7ReportGeneration } from '../hooks';
import { K7AcademicYearSelect } from './k7-academic-year-select';

export interface K7UniversityFilterSelection {
  year?: number;
  facultyId?: number;
  departmentId?: number;
  targetAccountId?: number;
  employeeId?: number;
  position?: string;
}

interface Props {
  years: number[];
  faculties: EntityIdName[];
  cathedras: K7FormCathedra[];
  reports: K7ReportRequest[];
  isLoadingReports: boolean;
  onFilterChange: (selection: K7UniversityFilterSelection) => void;
  onRequestCreated: (request: K7ReportRequest) => void;
}

export const K7UniversityReportFilters = ({
  years,
  faculties,
  cathedras,
  reports,
  isLoadingReports,
  onFilterChange,
  onRequestCreated,
}: Props) => {
  const t = useTranslations('private.k-7');
  const tFilters = useTranslations('private.k-7.filters');
  const { errorToast } = useServerErrorToast();
  const [selectedYear, setSelectedYear] = useState(years[0]?.toString() ?? '');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [departmentProfiles, setDepartmentProfiles] = useState<K7FormLecturerProfileOption[]>([]);
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(false);
  const lecturerRequestId = useRef(0);
  const selectedYearNumber = selectedYear === '' ? undefined : Number(selectedYear);
  const selectedFacultyId = selectedFaculty === '' ? undefined : Number(selectedFaculty);
  const selectedDepartmentId = selectedDepartment === '' ? undefined : Number(selectedDepartment);
  const selectedProfileData = selectedProfile === '' ? undefined : departmentProfiles[Number(selectedProfile)];
  const facultyCathedras = useMemo(
    () => cathedras.filter((cathedra) => cathedra.facultyId === selectedFacultyId),
    [cathedras, selectedFacultyId],
  );
  const { generate, isSubmitting, canGenerate } = useK7ReportGeneration({
    reports,
    selectedProfile: selectedProfileData,
    selectedYear: selectedYearNumber,
    targetUserAccountId: selectedProfileData?.userAccountId,
    onRequestCreated,
  });

  useEffect(() => {
    onFilterChange({
      year: selectedYearNumber,
      facultyId: selectedFacultyId,
      departmentId: selectedDepartmentId,
      targetAccountId: selectedProfileData?.userAccountId,
      employeeId: selectedProfileData?.employeeId,
      position: selectedProfileData?.position,
    });
  }, [onFilterChange, selectedDepartmentId, selectedFacultyId, selectedProfileData, selectedYearNumber]);

  const handleFacultyChange = (facultyId: string) => {
    lecturerRequestId.current += 1;
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    setSelectedProfile('');
    setDepartmentProfiles([]);
    setIsLoadingLecturers(false);
  };

  const handleDepartmentChange = async (departmentId: string) => {
    const requestId = ++lecturerRequestId.current;
    const parsedDepartmentId = Number(departmentId);

    setSelectedDepartment(departmentId);
    setSelectedProfile('');
    setDepartmentProfiles([]);
    setIsLoadingLecturers(true);

    try {
      const lecturers = await getK7FormLecturers(parsedDepartmentId);
      if (requestId !== lecturerRequestId.current) return;

      const profiles = lecturers
        .flatMap(({ profiles: lecturerProfiles, ...lecturer }) =>
          lecturerProfiles
            .filter((profile) => profile.departmentId === parsedDepartmentId)
            .map((profile) => ({ ...lecturer, ...profile })),
        )
        .sort(
          (first, second) =>
            first.fullName.localeCompare(second.fullName) || first.position.localeCompare(second.position),
        );

      setDepartmentProfiles(profiles);
    } catch {
      if (requestId === lecturerRequestId.current) errorToast();
    } finally {
      if (requestId === lecturerRequestId.current) setIsLoadingLecturers(false);
    }
  };

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-4">
      <K7AcademicYearSelect
        id="academic-year-university"
        years={years}
        value={selectedYear}
        onValueChange={setSelectedYear}
        disabled={isSubmitting}
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="faculty-university">{tFilters('faculty')}</Label>
        <Select
          value={selectedFaculty}
          onValueChange={handleFacultyChange}
          disabled={isSubmitting || faculties.length === 0}
        >
          <SelectTrigger
            id="faculty-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectFaculty')} />
          </SelectTrigger>
          <SelectContent>
            {faculties.map((faculty) => (
              <SelectItem key={faculty.id} value={String(faculty.id)}>
                {faculty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="department-university">{tFilters('cathedra')}</Label>
        <Select
          value={selectedDepartment}
          onValueChange={handleDepartmentChange}
          disabled={isSubmitting || selectedFacultyId === undefined || facultyCathedras.length === 0}
        >
          <SelectTrigger
            id="department-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectCathedra')} />
          </SelectTrigger>
          <SelectContent>
            {facultyCathedras.map((cathedra) => (
              <SelectItem key={cathedra.id} value={String(cathedra.id)}>
                {cathedra.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="lecturer-university">{tFilters('lecturerProfile')}</Label>
        <Select
          value={selectedProfile}
          onValueChange={setSelectedProfile}
          disabled={
            isSubmitting || selectedDepartmentId === undefined || isLoadingLecturers || departmentProfiles.length === 0
          }
        >
          <SelectTrigger
            id="lecturer-university"
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={tFilters('selectLecturerProfile')} />
          </SelectTrigger>
          <SelectContent>
            {departmentProfiles.map((profile, index) => (
              <SelectItem
                key={`${profile.userAccountId}-${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={String(index)}
              >
                {profile.fullName} - {profile.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end lg:col-span-full">
        <Button
          size="small"
          className="h-10 w-full rounded-md px-4 py-0 text-xs sm:w-auto"
          loading={isSubmitting}
          disabled={!canGenerate || isLoadingReports}
          onClick={generate}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
