'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { deleteSbpPeriod } from '@/actions/sbp-periods.actions';
import { Heading2 } from '@/components/typography';
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
import { EntityIdName } from '@/types/models/entity-id-name';
import { SbpPeriod } from '@/types/models/sbp-periods';

import { PeriodForm } from './period-form';
import { PeriodsTable } from './periods-table';
import { periodLabel } from './schema';

interface Props {
  periods: SbpPeriod[];
  studyYears: EntityIdName[];
}

export const PeriodsManagement = ({ periods, studyYears }: Props) => {
  const t = useTranslations('private.studbonuspointsrights.periods');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const [form, setForm] = useState<{ period?: SbpPeriod } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SbpPeriod | null>(null);

  const deletion = useMutation({
    mutationFn: deleteSbpPeriod,
    onSuccess: (result) => {
      setDeleteTarget(null);
      if (result.ok) {
        toast({ title: t('actions.deleted') });
      } else {
        toast({ title: t(`errors.${result.violation.code}`, { period: '' }), variant: 'destructive' });
      }
    },
    onError: () => errorToast(),
  });

  const handleAdd = () => setForm({});
  const handleEdit = (period: SbpPeriod) => setForm({ period });
  const handleClose = () => setForm(null);
  const handleSaved = () => {
    setForm(null);
    toast({ title: t('actions.saved') });
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
        <Button size="small" disabled={deletion.isPending} onClick={handleAdd}>
          {t('actions.add')}
        </Button>
      </div>
      <PeriodsTable periods={periods} disabled={deletion.isPending} onEdit={handleEdit} onDelete={setDeleteTarget} />
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
