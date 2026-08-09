'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { getK7FormFilters } from '@/actions/k7-form.actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { K7FormFilters } from '@/types/models/k7-form';

interface Props {
  filters: K7FormFilters;
  type: 'personal' | 'department';
}

export const K7ReportFilters = ({ filters, type }: Props) => {
  const t = useTranslations('private.k-reports.k-7');
  const { errorToast } = useServerErrorToast();
  const requestIdRef = useRef(0);
  const isDepartment = type === 'department';
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>();
  const [availableFilters, setAvailableFilters] = useState<K7FormFilters | null>(isDepartment ? null : filters);
  const [selectedYear, setSelectedYear] = useState(isDepartment ? undefined : filters.years[0]?.toString());
  const [selectedProfile, setSelectedProfile] = useState(
    isDepartment || filters.profiles.length === 0 ? undefined : '0',
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLecturerChange = async (value: string) => {
    const requestId = ++requestIdRef.current;

    setSelectedLecturerId(value);
    setAvailableFilters(null);
    setSelectedYear(undefined);
    setSelectedProfile(undefined);
    setIsLoading(true);

    try {
      const lecturerFilters = await getK7FormFilters(Number(value));

      if (requestId !== requestIdRef.current) return;

      setAvailableFilters(lecturerFilters);
      setSelectedYear(lecturerFilters.years[0]?.toString());
      setSelectedProfile(lecturerFilters.profiles.length > 0 ? '0' : undefined);
    } catch {
      if (requestId === requestIdRef.current) errorToast();
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  const columnsClassName = isDepartment
    ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]'
    : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]';

  return (
    <div className={`grid min-w-0 gap-4 ${columnsClassName}`}>
      {isDepartment && (
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor="lecturer-department">{t('filters.lecturer')}</Label>
          <Select value={selectedLecturerId} onValueChange={handleLecturerChange}>
            <SelectTrigger
              id="lecturer-department"
              variant="small"
              className="border-neutral-300 text-sm text-neutral-900"
            >
              <SelectValue placeholder={t('filters.selectLecturer')} />
            </SelectTrigger>
            <SelectContent>
              {filters.lecturers.map((lecturer) => (
                <SelectItem key={lecturer.userAccountId} value={lecturer.userAccountId.toString()}>
                  {lecturer.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`academic-year-${type}`}>{t('filters.academicYear')}</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isLoading || !availableFilters}>
          <SelectTrigger
            id={`academic-year-${type}`}
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectAcademicYear')} />
          </SelectTrigger>
          <SelectContent>
            {availableFilters?.years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}-{year + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`work-profile-${type}`}>{t('filters.workProfile')}</Label>
        <Select value={selectedProfile} onValueChange={setSelectedProfile} disabled={isLoading || !availableFilters}>
          <SelectTrigger
            id={`work-profile-${type}`}
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectWorkProfile')} />
          </SelectTrigger>
          <SelectContent>
            {availableFilters?.profiles.map((profile, index) => (
              <SelectItem
                key={`${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                value={index.toString()}
              >
                {profile.departmentName} - {profile.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={`flex justify-end ${isDepartment ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
        <Button
          size="small"
          className="h-10 w-full rounded-[8px] px-4 py-0 text-xs sm:w-auto"
          disabled={isLoading || !selectedYear || selectedProfile === undefined}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
