'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { deleteVoteTerm, getVoteCriteriaAdministration } from '@/actions/vote-administration.actions';
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
import { VoteAdminTerm, VoteCriteriaAdministrationData } from '@/types/models/vote/administration';

import { voteAdministrationQueryKey } from '../query-keys';
import { PeriodForm } from './period-form';
import { PeriodsTable } from './periods-table';

interface Props {
  data: VoteCriteriaAdministrationData;
}

export const PeriodsManagement = ({ data: initialData }: Props) => {
  const t = useTranslations('private.adminvote.periods.actions');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: voteAdministrationQueryKey,
    queryFn: getVoteCriteriaAdministration,
    initialData,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<VoteAdminTerm>();
  const [deleteTarget, setDeleteTarget] = useState<VoteAdminTerm | null>(null);
  const deletion = useMutation({
    mutationFn: deleteVoteTerm,
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: voteAdministrationQueryKey });
      toast({ title: t('deleted') });
    },
    onError: () => errorToast(),
  });
  const disabled = isFetching || deletion.isPending || isFormOpen;

  const handleAdd = () => {
    setEditingPeriod(undefined);
    setIsFormOpen(true);
  };
  const handleEdit = (period: VoteAdminTerm) => {
    setEditingPeriod(period);
    setIsFormOpen(true);
  };
  const handleClose = () => {
    setIsFormOpen(false);
  };
  const handleSaved = () => {
    setIsFormOpen(false);
    toast({ title: t('saved') });
  };
  const handleDeleteOpenChange = (open: boolean) => {
    if (!open && !deletion.isPending) {
      setDeleteTarget(null);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };
  const handleDeleteConfirm = () => {
    if (deleteTarget && !disabled && deleteTarget.respondentCount === 0) {
      deletion.mutate(deleteTarget.id);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading2 className="text-lg leading-6 lg:text-lg lg:leading-6">{t('title')}</Heading2>
        <Button size="small" disabled={disabled} onClick={handleAdd}>
          {t('add')}
        </Button>
      </div>
      <PeriodsTable periods={data.terms} disabled={disabled} onEdit={handleEdit} onDelete={setDeleteTarget} />
      {isFormOpen && (
        <PeriodForm period={editingPeriod} periods={data.terms} onClose={handleClose} onSaved={handleSaved} />
      )}
      <AlertDialog open={!!deleteTarget} onOpenChange={handleDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete-title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete-description', { number: deleteTarget?.number ?? 0, year: deleteTarget?.studyYear ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="secondary" disabled={deletion.isPending} onClick={handleDeleteCancel}>
              {t('cancel')}
            </Button>
            <Button
              className="bg-status-danger-300 hover:bg-status-danger-300"
              loading={deletion.isPending}
              disabled={isFetching}
              onClick={handleDeleteConfirm}
            >
              {t('confirm-delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
