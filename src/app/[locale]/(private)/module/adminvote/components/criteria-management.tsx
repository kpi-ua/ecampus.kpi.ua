'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { archiveVoteCriterion, getVoteCriteriaAdministration } from '@/actions/vote-administration.actions';
import { Heading2 } from '@/components/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { VoteAdminCriterion, VoteCriteriaAdministrationData } from '@/types/models/vote/administration';

import { ArchivedCriteriaTable } from './archived-criteria-table';
import { CurrentCriteriaTable } from './current-criteria-table';
import { CriterionForm } from './criterion-form';
import { voteAdministrationQueryKey } from '../query-keys';

interface Props {
  data: VoteCriteriaAdministrationData;
}

export const CriteriaManagement = ({ data: initialData }: Props) => {
  const t = useTranslations('private.adminvote.actions');
  const titleTranslation = useTranslations('private.adminvote');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: voteAdministrationQueryKey,
    queryFn: getVoteCriteriaAdministration,
    initialData,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<VoteAdminCriterion>();
  const [archiveTarget, setArchiveTarget] = useState<VoteAdminCriterion | null>(null);

  const archiveMutation = useMutation({
    mutationFn: archiveVoteCriterion,
    onSuccess: async () => {
      setArchiveTarget(null);
      await queryClient.invalidateQueries({ queryKey: voteAdministrationQueryKey });
      toast({ title: t('archived-success') });
    },
    onError: () => errorToast(),
  });

  const archiving = archiveMutation.isPending;
  const disabled = data.isVotingOpen || isFetching || archiving;

  const handleAdd = () => {
    setEditingCriterion(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (criterion: VoteAdminCriterion) => {
    setEditingCriterion(criterion);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleSaved = () => {
    setIsFormOpen(false);
    toast({ title: t('saved-success') });
  };

  const handleArchiveOpenChange = (open: boolean) => {
    if (!open && !archiving) {
      setArchiveTarget(null);
    }
  };

  const handleArchiveCancel = () => {
    setArchiveTarget(null);
  };

  const handleArchiveConfirm = () => {
    if (archiveTarget && !disabled) {
      archiveMutation.mutate(archiveTarget.id);
    }
  };

  return (
    <Tabs defaultValue="current" className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading2 className="text-lg leading-6 lg:text-lg lg:leading-6">{titleTranslation('title')}</Heading2>
        <TabsContent value="current" className="mt-0">
          <Button size="small" disabled={disabled || isFormOpen} onClick={handleAdd}>
            {t('add')}
          </Button>
        </TabsContent>
      </div>
      <Show when={data.isVotingOpen}>
        <Alert>
          <AlertDescription>{t('voting-open')}</AlertDescription>
        </Alert>
      </Show>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList size="small">
          <TabsTrigger value="current" disabled={isFormOpen || archiving}>
            {t('current')}
          </TabsTrigger>
          <TabsTrigger value="archived" disabled={isFormOpen || archiving}>
            {t('archived')}
          </TabsTrigger>
        </TabsList>
      </div>
      {isFormOpen && !data.isVotingOpen && (
        <CriterionForm criterion={editingCriterion} onClose={handleFormClose} onSaved={handleSaved} />
      )}
      <TabsContent value="current" className="mt-0">
        <CurrentCriteriaTable
          criteria={data.currentCriteria}
          disabled={disabled || isFormOpen}
          onEdit={handleEdit}
          onArchive={setArchiveTarget}
        />
      </TabsContent>
      <TabsContent value="archived" className="mt-0">
        <ArchivedCriteriaTable criteria={data.archivedCriteria} />
      </TabsContent>
      <AlertDialog open={!!archiveTarget} onOpenChange={handleArchiveOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('archive-title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('archive-description', {
                name: archiveTarget?.name ?? '',
                coefficient: archiveTarget?.coefficient ?? 0,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="secondary" disabled={archiving} onClick={handleArchiveCancel}>
              {t('cancel')}
            </Button>
            <Button loading={archiving} disabled={data.isVotingOpen || isFetching} onClick={handleArchiveConfirm}>
              {t('confirm-archive')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
};
