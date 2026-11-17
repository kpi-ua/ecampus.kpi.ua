'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo, useState } from 'react';

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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTableSort } from '@/hooks/use-table-sort';
import { PlanLoad, PlanWorkplace, PlanYear } from '@/types/models/plans';

import { PlanForm } from './plan-form';

interface Props {
  currentYear: PlanYear;
  workplaces: PlanWorkplace[];
  initialLoads: PlanLoad[];
}

export const WorkloadsTab = ({ currentYear, workplaces, initialLoads }: Props) => {
  const t = useTranslations('private.plans');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [semester, setSemester] = useState(0);
  const [workplaceId, setWorkplaceId] = useState(0);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editHours, setEditHours] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteActive, setDeleteActive] = useState(false);
  const currentYearId = currentYear.id;
  const canEdit = currentYearId > 0;

  const queryClient = useQueryClient();
  const loadsQuery = useQuery({
    queryKey: ['plans', currentYearId, 'loads', semester],
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
    },
  });
  const busy = mutation.isPending;
  const loading = loadsQuery.isFetching;
  const error = mutation.error?.message ?? (loadsQuery.isError ? t('requestError') : '');
  const notice = mutation.isSuccess ? mutation.data : null;
  const run = (action: () => Promise<{ ok: boolean; code?: string }>, success: string) =>
    mutation.mutate({ action, success });
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
  const { sortedRows, sortHandlers } = useTableSort(filteredLoads, undefined, [
    'curriculumRow',
    'workplace',
    'semester',
    'group',
    'loadType',
    'plannedHours',
  ]);
  const groupedLoads = useMemo(() => {
    const groups = new Map<string, PlanLoad[]>();
    for (const load of sortedRows) {
      const key = `${load.workplaceId}-${load.curriculumRowId}-${load.semester}`;
      const entries = groups.get(key) ?? [];
      entries.push(load);
      groups.set(key, entries);
    }
    return [...groups.entries()].map(([key, entries]) => ({ key, entries, first: entries[0] }));
  }, [sortedRows]);
  const totalHours = filteredLoads.reduce((sum, load) => sum + load.plannedHours, 0);

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium">
          {t('semester')}
          <Select
            value={String(semester)}
            onValueChange={(value) => {
              setSemester(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t('allSemesters')}</SelectItem>
              <SelectItem value="1">{t('firstSemester')}</SelectItem>
              <SelectItem value="2">{t('secondSemester')}</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <div>
          <label className="grid gap-1 text-sm font-medium">
            {t('workplace')}
            <Select
              value={String(workplaceId)}
              onValueChange={(value) => {
                setWorkplaceId(Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('allWorkplaces')}</SelectItem>
                {workplaces.map((workplace) => (
                  <SelectItem key={workplace.id} value={String(workplace.id)}>
                    {workplace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          {t('search')}
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder={t('searchPlaceholder')}
          />
        </label>
      </div>
      {notice && (
        <Paragraph className="my-3 text-sm text-green-700" role="status">
          {notice}
        </Paragraph>
      )}
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
      <div>
        <Button type="button" size="small" icon={<Plus />} onClick={() => setShowForm(true)}>
          {t('addLoad')}
        </Button>
        <div className="mb-3 flex flex-wrap gap-5 text-sm text-neutral-600">
          <span>{t('recordsCount', { count: filteredLoads.length })}</span>
          <span>{t('hoursTotal', { hours: totalHours.toLocaleString() })}</span>
        </div>
        {filteredLoads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-14 text-center">
            <Paragraph className="my-0 text-sm text-neutral-600">{t('emptyLoads')}</Paragraph>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <span className="sr-only">{t('expandGroup')}</span>
                </TableHead>
                <TableHead sortHandlers={sortHandlers} sortHeader="curriculumRow">
                  {t('curriculumRow')}
                </TableHead>
                <TableHead sortHandlers={sortHandlers} sortHeader="workplace">
                  {t('workplace')}
                </TableHead>
                <TableHead sortHandlers={sortHandlers} sortHeader="semester">
                  {t('semester')}
                </TableHead>
                <TableHead>{t('groups')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedLoads.map((section) => (
                <Fragment key={section.key}>
                  <TableRow>
                    <TableCell>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md hover:bg-neutral-100 focus-visible:outline-2"
                        aria-expanded={expandedGroups.has(section.key)}
                        aria-label={t(expandedGroups.has(section.key) ? 'collapseGroup' : 'expandGroup')}
                        onClick={() =>
                          setExpandedGroups((current) => {
                            const next = new Set(current);
                            if (next.has(section.key)) {
                              next.delete(section.key);
                            } else {
                              next.add(section.key);
                            }
                            return next;
                          })
                        }
                      >
                        {expandedGroups.has(section.key) ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{section.first.curriculumRow}</TableCell>
                    <TableCell>{section.first.workplace}</TableCell>
                    <TableCell>{section.first.semester === 1 ? t('firstSemester') : t('secondSemester')}</TableCell>
                    <TableCell>
                      {[...new Set(section.entries.map((load) => load.group))]
                        .sort((a, b) => a.localeCompare(b))
                        .join(', ')}
                    </TableCell>
                  </TableRow>
                  {expandedGroups.has(section.key) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-neutral-50 p-4">
                        {' '}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead sortHandlers={sortHandlers} sortHeader="group">
                                {t('groups')}
                              </TableHead>
                              <TableHead sortHandlers={sortHandlers} sortHeader="loadType">
                                {t('loadType')}
                              </TableHead>
                              <TableHead sortHandlers={sortHandlers} sortHeader="plannedHours">
                                {t('plannedHours')}
                              </TableHead>
                              {canEdit && <TableHead>{t('actions')}</TableHead>}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.entries.map((load) => (
                              <TableRow key={load.id}>
                                <TableCell>{load.group}</TableCell>
                                <TableCell>{load.loadType}</TableCell>
                                <TableCell>
                                  {editId === load.id ? (
                                    <Input
                                      className="min-w-24"
                                      type="number"
                                      min="0"
                                      max="1000"
                                      step="0.1"
                                      value={editHours}
                                      onChange={(event) => setEditHours(event.target.value)}
                                    />
                                  ) : (
                                    load.plannedHours.toLocaleString()
                                  )}
                                </TableCell>
                                {canEdit && (
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      {editId === load.id ? (
                                        <>
                                          <Button
                                            type="button"
                                            size="small"
                                            loading={busy}
                                            disabled={
                                              editHours === '' || Number(editHours) < 0 || Number(editHours) > 1000
                                            }
                                            onClick={() =>
                                              run(() => updatePlanHours(load.id, Number(editHours)), t('saved'))
                                            }
                                          >
                                            {t('save')}
                                          </Button>
                                          <Button
                                            type="button"
                                            size="small"
                                            variant="tertiary"
                                            onClick={() => setEditId(null)}
                                          >
                                            {t('cancel')}
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <Button
                                            type="button"
                                            size="small"
                                            variant="tertiary"
                                            icon={<Pencil />}
                                            title={t('editHours')}
                                            onClick={() => {
                                              setEditId(load.id);
                                              setEditHours(String(load.plannedHours));
                                            }}
                                          >
                                            {t('edit')}
                                          </Button>
                                          <Button
                                            type="button"
                                            size="small"
                                            variant="tertiary"
                                            icon={<Trash2 />}
                                            title={t('delete')}
                                            onClick={() => {
                                              setDeleteId(load.id);
                                              setDeleteActive(false);
                                            }}
                                          >
                                            {t('delete')}
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t('addTitle')}</DialogTitle>
            <DialogDescription>{t('addHint')}</DialogDescription>
          </DialogHeader>
          {showForm && (
            <PlanForm
              workplaces={workplaces}
              yearName={currentYear.name}
              onCancel={() => setShowForm(false)}
              onSaved={async () => {
                await queryClient.invalidateQueries({ queryKey: ['plans'] });
                setShowForm(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDeleteActive(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteActive ? t('activeAttestationTitle') : t('deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteActive ? t('activeAttestationDescription') : t('deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(event) => {
                event.preventDefault();
                if (deleteId !== null) {
                  run(() => deletePlanLoad(deleteId, deleteActive), t('deleted'));
                }
              }}
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
