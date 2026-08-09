'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { createK7FormRequest, getK7FormFilters } from '@/actions/k7-form.actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useRouter } from '@/i18n/routing';
import { K7_REPORT_REQUEST_STATUS, K7FormFilters, K7ReportRequest } from '@/types/models/k7-form';

interface Props {
  filters: K7FormFilters;
  reports: K7ReportRequest[];
  type: 'personal' | 'department';
}

const activeRequestStatuses = new Set<K7ReportRequest['status']>([
  K7_REPORT_REQUEST_STATUS.Pending,
  K7_REPORT_REQUEST_STATUS.InProgress,
]);

export const K7ReportFilters = ({ filters, reports, type }: Props) => {
  const t = useTranslations('private.k-reports.k-7');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();
  const requestIdRef = useRef(0);
  const isDepartment = type === 'department';
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>();
  const [availableFilters, setAvailableFilters] = useState<K7FormFilters | null>(isDepartment ? null : filters);
  const [selectedYear, setSelectedYear] = useState(isDepartment ? undefined : filters.years[0]?.toString());
  const [selectedProfile, setSelectedProfile] = useState(
    isDepartment || filters.profiles.length === 0 ? undefined : '0',
  );
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLecturerChange = async (value: string) => {
    const requestId = ++requestIdRef.current;

    setSelectedLecturerId(value);
    setAvailableFilters(null);
    setSelectedYear(undefined);
    setSelectedProfile(undefined);
    setIsLoadingFilters(true);

    try {
      const lecturerFilters = await getK7FormFilters(Number(value));

      if (requestId !== requestIdRef.current) return;

      setAvailableFilters(lecturerFilters);
      setSelectedYear(lecturerFilters.years[0]?.toString());
      setSelectedProfile(lecturerFilters.profiles.length > 0 ? '0' : undefined);
    } catch {
      if (requestId === requestIdRef.current) errorToast();
    } finally {
      if (requestId === requestIdRef.current) setIsLoadingFilters(false);
    }
  };

  const selectedProfileData =
    selectedProfile === undefined ? undefined : availableFilters?.profiles[Number(selectedProfile)];
  const selectedYearNumber = selectedYear === undefined ? undefined : Number(selectedYear);
  const activeRequest = reports.find(
    (report) =>
      activeRequestStatuses.has(report.status) &&
      report.year === selectedYearNumber &&
      report.employeeId === selectedProfileData?.employeeId &&
      report.departmentId === selectedProfileData.departmentId &&
      report.position === selectedProfileData.position &&
      (!isDepartment || report.targetUserAccountId === Number(selectedLecturerId)),
  );

  const handleGenerate = async () => {
    if (!selectedProfileData || selectedYearNumber === undefined || isSubmitting) return;

    if (activeRequest) {
      router.push(
        `/k-7/preview?requestId=${encodeURIComponent(activeRequest.k7ReportRequestId)}&pending=true${isDepartment ? '&all=true' : ''}`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const reportRequest = await createK7FormRequest({
        ...(isDepartment && selectedLecturerId ? { targetUserAccountId: Number(selectedLecturerId) } : {}),
        year: selectedYearNumber,
        employeeId: selectedProfileData.employeeId,
        departmentId: selectedProfileData.departmentId,
        position: selectedProfileData.position,
      });

      router.push(
        `/k-7/preview?requestId=${encodeURIComponent(reportRequest.k7ReportRequestId)}&pending=true${isDepartment ? '&all=true' : ''}`,
      );
    } catch {
      errorToast();
    } finally {
      setIsSubmitting(false);
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
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
          disabled={isLoadingFilters || !availableFilters || isSubmitting}
        >
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
        <Select
          value={selectedProfile}
          onValueChange={setSelectedProfile}
          disabled={isLoadingFilters || !availableFilters || isSubmitting}
        >
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

      <div className={`flex flex-col items-end gap-3 ${isDepartment ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
        <Button
          size="small"
          className="h-10 w-full rounded-[8px] px-4 py-0 text-xs sm:w-auto"
          disabled={
            isLoadingFilters || isSubmitting || selectedYearNumber === undefined || selectedProfileData === undefined
          }
          onClick={handleGenerate}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
