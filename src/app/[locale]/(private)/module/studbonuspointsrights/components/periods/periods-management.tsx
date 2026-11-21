'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { deleteSbpPeriod, getSbpPeriods, getSbpPeriodStudyYears } from '@/actions/sbp-periods.actions';
import { Heading2, Paragraph } from '@/components/typography';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { SbpPeriod } from '@/types/models/sbp-periods';

import { PeriodForm } from './period-form';
import { PeriodsTable } from './periods-table';
import { periodLabel } from './schema';

const PERIODS_QUERY_KEY = ['sbp-periods'] as const;

/** Loads its own data, so the periods are requested only once the tab is opened. */
export const PeriodsManagement = () => {
  const t = useTranslations('private.studbonuspointsrights.periods');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const periodsQuery = useQuery({ queryKey: PERIODS_QUERY_KEY, queryFn: getSbpPeriods, retry: false });
  const yearsQuery = useQuery({
    queryKey: [...PERIODS_QUERY_KEY, 'study-years'],
    queryFn: getSbpPeriodStudyYears,
    retry: false,
  });
  const periods = periodsQuery.data ?? [];
  const studyYears = yearsQuery.data ?? [];
  const isReady = periodsQuery.isSuccess && yearsQuery.isSuccess;
  const isError = periodsQuery.isError || yearsQuery.isError;
  const refreshPeriods = () => queryClient.invalidateQueries({ queryKey: PERIODS_QUERY_KEY, exact: true });
  const [form, setForm] = useState<{ period?: SbpPeriod } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SbpPeriod | null>(null);

  const deletion = useMutation({
    mutationFn: deleteSbpPeriod,
    onSuccess: async (result) => {
      setDeleteTarget(null);
      await refreshPeriods();
      const errorKey = result.ok ? null : `errors.${result.violation.code}`;
      if (!errorKey) {
        toast({ title: t('actions.deleted') });
      } else if (t.has(errorKey)) {
        toast({ title: t(errorKey, { period: '' }), variant: 'destructive' });
      } else {
        errorToast();
      }
    },
    onError: () => errorToast(),
  });

  const handleAdd = () => setForm({});
  const handleEdit = (period: SbpPeriod) => setForm({ period });
  const handleClose = () => setForm(null);
  const handleSaved = async () => {
    setForm(null);
    toast({ title: t('actions.saved') });
    await refreshPeriods();
  };
  const handleDeleteOpenChange = (open: boolean) => {
    if (!open && !deletion.isPending) {
      setDeleteTarget(null);
    }
  };
  const handleDeleteConfirm = () => {
    if (deleteTarget && !deletion.isPending) {
      deletion.mutate(deleteTarget.id);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading2 className="text-lg leading-6 lg:text-lg lg:leading-6">{t('actions.title')}</Heading2>
        <Button size="small" disabled={deletion.isPending || !isReady} onClick={handleAdd}>
          {t('actions.add')}
        </Button>
      </div>
      {isReady ? (
        <PeriodsTable periods={periods} disabled={deletion.isPending} onEdit={handleEdit} onDelete={setDeleteTarget} />
      ) : (
        <Paragraph className="my-0 py-12 text-center text-sm text-neutral-600">
          {t(isError ? 'loadError' : 'loading')}
        </Paragraph>
      )}
      {form && (
        <PeriodForm
          period={form.period}
          periods={periods}
          studyYears={studyYears}
          onClose={handleClose}
          onSaved={handleSaved}
        />
      )}
      <AlertDialog open={!!deleteTarget} onOpenChange={handleDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget && t('actions.deleteTitle', { period: periodLabel(t, deleteTarget) })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t('actions.deleteDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="secondary" disabled={deletion.isPending} onClick={() => setDeleteTarget(null)}>
              {t('actions.cancel')}
            </Button>
            <Button
              className="bg-status-danger-300 hover:bg-status-danger-300"
              loading={deletion.isPending}
              onClick={handleDeleteConfirm}
            >
              {t('actions.confirmDelete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
