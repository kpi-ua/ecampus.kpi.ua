'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { createK7FormRequest } from '@/actions/k7-form.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { K7_REPORT_REQUEST_STATUS, K7FormLecturerProfile, K7ReportRequest } from '@/types/models/k7-form';

const activeRequestStatuses = new Set<K7ReportRequest['status']>([
  K7_REPORT_REQUEST_STATUS.Pending,
  K7_REPORT_REQUEST_STATUS.InProgress,
  K7_REPORT_REQUEST_STATUS.DataReady,
]);

interface Params {
  reports: K7ReportRequest[];
  selectedProfile?: K7FormLecturerProfile;
  selectedYear?: number;
  targetUserAccountId?: number;
  onRequestCreated?: (request: K7ReportRequest) => void;
}

export const useK7ReportGeneration = ({
  reports,
  selectedProfile,
  selectedYear,
  targetUserAccountId,
  onRequestCreated,
}: Params) => {
  const t = useTranslations('private.k-7');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeRequest = reports.find(
    (report) =>
      activeRequestStatuses.has(report.status) &&
      report.year === selectedYear &&
      report.employeeId === selectedProfile?.employeeId &&
      report.departmentId === selectedProfile?.departmentId &&
      report.position === selectedProfile?.position &&
      (targetUserAccountId === undefined || report.targetUserAccountId === targetUserAccountId),
  );

  const generate = async () => {
    if (!selectedProfile || selectedYear === undefined || isSubmitting) return;

    if (activeRequest) {
      toast({ title: t('generation.queuedTitle'), description: t('generation.queuedDescription') });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createK7FormRequest({
        ...(targetUserAccountId === undefined ? {} : { targetUserAccountId }),
        year: selectedYear,
        employeeId: selectedProfile.employeeId,
        departmentId: selectedProfile.departmentId,
        position: selectedProfile.position,
      });

      if (result.outcome === 'throttled') {
        toast({
          variant: 'destructive',
          title: t('errors.throttledTitle'),
          description: result.message ?? t('errors.throttledDescription'),
        });
        return;
      }

      toast({ title: t('generation.queuedTitle'), description: t('generation.queuedDescription') });
      onRequestCreated?.(result.request);
    } catch {
      errorToast();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    generate,
    isSubmitting,
    canGenerate: selectedProfile !== undefined && selectedYear !== undefined,
  };
};
