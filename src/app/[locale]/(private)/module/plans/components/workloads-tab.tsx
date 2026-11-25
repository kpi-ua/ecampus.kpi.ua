'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useMemo, useState } from 'react';

import { deletePlanLoad, getPlanLoads, updatePlanHours } from '@/actions/plans.actions';
import { Paragraph } from '@/components/typography';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlanLoad, PlanWorkplace } from '@/types/models/plans';

import { PlanForm } from './plan-form';
import { WorkloadsFilters } from './workloads-filters';
import { WorkloadsTable } from './workloads-table';

interface Props {
  workplaces: PlanWorkplace[];
  initialLoads: PlanLoad[];
}

export const WorkloadsTab = ({ workplaces, initialLoads }: Props) => {
  const t = useTranslations('private.plans');
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [semester, setSemester] = useState(0);
  const [workplaceId, setWorkplaceId] = useState(0);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editHours, setEditHours] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteActive, setDeleteActive] = useState(false);

  const queryClient = useQueryClient();
  const loadsQuery = useQuery({
    queryKey: ['plans', 'loads', semester],
    queryFn: () => getPlanLoads(semester),
    initialData: semester === 0 ? initialLoads : undefined,
  });
  const loads = useMemo(() => loadsQuery.data ?? [], [loadsQuery.data]);
  const mutation = useMutation({
    mutationFn: async ({
      action,
      success,
    }: {
      action: () => Promise<{ ok: boolean; code?: string }>;
      success: string;
    }) => {
      const result = await action();
      if (!result.ok) {
        if (result.code === 'active-attestation') {
          setDeleteActive(true);
          return null;
        }
        throw new Error(result.code === 'completed-attestation' ? t('completedAttestation') : t('requestError'));
      }
      return success;
    },
    onSuccess: async (message) => {
      if (!message) {
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      setEditId(null);
      setDeleteId(null);
      setDeleteActive(false);
      toast({ title: message });
    },
  });
  const busy = mutation.isPending;
  const loading = loadsQuery.isFetching;
  const error = mutation.error?.message ?? (loadsQuery.isError ? t('requestError') : '');
  const run = (action: () => Promise<{ ok: boolean; code?: string }>, success: string) =>
    mutation.mutate({ action, success });

  const handleAddLoad = () => setShowForm(true);
  const handleCancelForm = () => setShowForm(false);
  const handleFormSaved = async () => {
    await queryClient.invalidateQueries({ queryKey: ['plans'] });
    setShowForm(false);
  };

  const handleEdit = (load: PlanLoad) => {
    setEditId(load.id);
    setEditHours(String(load.plannedHours));
  };

  const handleCancelEdit = () => setEditId(null);
  const handleSaveHours = (id: number, hours: number) => run(() => updatePlanHours(id, hours), t('saved'));

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteActive(false);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) {
      setDeleteId(null);
      setDeleteActive(false);
    }
  };

  const handleDeleteConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (deleteId !== null) {
      run(() => deletePlanLoad(deleteId, deleteActive), t('deleted'));
    }
  };

  const query = search.trim().toLocaleLowerCase();
  const filteredLoads = useMemo(
    () =>
      loads.filter((load) => {
        return (
          (!workplaceId || load.workplaceId === workplaceId) &&
          `${load.curriculumRow} ${load.group} ${load.loadType} ${load.workplace}`.toLocaleLowerCase().includes(query)
        );
      }),
    [loads, workplaceId, query],
  );

  return (
    <div>
      <WorkloadsFilters
        workplaces={workplaces}
        semester={semester}
        workplaceId={workplaceId}
        search={search}
        onSemesterChange={setSemester}
        onWorkplaceChange={setWorkplaceId}
        onSearchChange={setSearch}
        onAddLoad={handleAddLoad}
      />
      {error && (
        <Paragraph className="my-3 text-sm text-red-700" role="alert">
          {error}
        </Paragraph>
      )}
      {loading && (
        <Paragraph className="my-3 text-sm text-neutral-500" role="status">
          {t('loading')}
        </Paragraph>
      )}
      <WorkloadsTable
        loads={filteredLoads}
        actions={{
          busy,
          editId,
          editHours,
          onEdit: handleEdit,
          onCancelEdit: handleCancelEdit,
          onHoursChange: setEditHours,
          onSave: handleSaveHours,
          onDelete: handleDelete,
        }}
      />
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t('addTitle')}</DialogTitle>
            <DialogDescription>{t('addHint')}</DialogDescription>
          </DialogHeader>
          {showForm && <PlanForm workplaces={workplaces} onCancel={handleCancelForm} onSaved={handleFormSaved} />}
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteId !== null} onOpenChange={handleDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteActive ? t('activeAttestationTitle') : t('deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteActive ? t('activeAttestationDescription') : t('deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-end gap-2 sm:space-x-0">
            <AlertDialogCancel disabled={busy}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={handleDeleteConfirm}>
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
