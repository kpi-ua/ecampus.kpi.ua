'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { createK7FormRequest } from '@/actions/k7-form.actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useRouter } from '@/i18n/routing';
import {
  K7_REPORT_REQUEST_STATUS,
  K7FormFilters,
  K7FormLecturerProfileOption,
  K7ReportRequest,
} from '@/types/models/k7-form';

interface Props {
  filters: K7FormFilters;
  reports: K7ReportRequest[];
  departmentProfiles: K7FormLecturerProfileOption[];
  type: 'personal' | 'department';
}

const activeRequestStatuses = new Set<K7ReportRequest['status']>([
  K7_REPORT_REQUEST_STATUS.Pending,
  K7_REPORT_REQUEST_STATUS.InProgress,
]);

export const K7ReportFilters = ({ filters, reports, departmentProfiles, type }: Props) => {
  const t = useTranslations('private.k-reports.k-7');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();
  const isDepartment = type === 'department';
  const [selectedYear, setSelectedYear] = useState(filters.years[0]?.toString());
  const [selectedProfile, setSelectedProfile] = useState(
    isDepartment || filters.profiles.length === 0 ? undefined : '0',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProfileIndex = selectedProfile === undefined ? undefined : Number(selectedProfile);
  const selectedDepartmentProfile =
    isDepartment && selectedProfileIndex !== undefined ? departmentProfiles[selectedProfileIndex] : undefined;
  const selectedProfileData =
    selectedProfileIndex === undefined
      ? undefined
      : (selectedDepartmentProfile ?? filters.profiles[selectedProfileIndex]);
  const selectedYearNumber = selectedYear === undefined ? undefined : Number(selectedYear);
  const targetUserAccountId = selectedDepartmentProfile?.userAccountId;
  const activeRequest = reports.find(
    (report) =>
      activeRequestStatuses.has(report.status) &&
      report.year === selectedYearNumber &&
      report.employeeId === selectedProfileData?.employeeId &&
      report.departmentId === selectedProfileData?.departmentId &&
      report.position === selectedProfileData?.position &&
      (!isDepartment || report.targetUserAccountId === targetUserAccountId),
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
        ...(targetUserAccountId === undefined ? {} : { targetUserAccountId }),
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

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`academic-year-${type}`}>{t('filters.academicYear')}</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isSubmitting}>
          <SelectTrigger
            id={`academic-year-${type}`}
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue placeholder={t('filters.selectAcademicYear')} />
          </SelectTrigger>
          <SelectContent>
            {filters.years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}-{year + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`work-profile-${type}`}>
          {t(isDepartment ? 'filters.lecturerProfile' : 'filters.workProfile')}
        </Label>
        <Select
          value={selectedProfile}
          onValueChange={setSelectedProfile}
          disabled={isSubmitting || (isDepartment ? departmentProfiles.length === 0 : filters.profiles.length === 0)}
        >
          <SelectTrigger
            id={`work-profile-${type}`}
            variant="small"
            className="border-neutral-300 text-sm text-neutral-900"
          >
            <SelectValue
              placeholder={t(isDepartment ? 'filters.selectLecturerProfile' : 'filters.selectWorkProfile')}
            />
          </SelectTrigger>
          <SelectContent>
            {isDepartment
              ? departmentProfiles.map((profile, index) => (
                  <SelectItem
                    key={`${profile.userAccountId}-${profile.employeeId}-${profile.departmentId}-${profile.position}`}
                    value={index.toString()}
                  >
                    {profile.fullName} - {profile.position}
                  </SelectItem>
                ))
              : filters.profiles.map((profile, index) => (
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

      <div className="flex justify-end lg:col-span-full">
        <Button
          size="small"
          className="h-10 w-full rounded-[8px] px-4 py-0 text-xs sm:w-auto"
          disabled={isSubmitting || selectedYearNumber === undefined || selectedProfileData === undefined}
          onClick={handleGenerate}
        >
          {t('actions.generate')}
        </Button>
      </div>
    </div>
  );
};
