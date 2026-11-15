'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import {
  deletePlanLoad,
  getPlanLoads,
  getPlanResponsibilities,
  setPlanResponsible,
  updatePlanHours,
} from '@/actions/plans.actions';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/common';
import { PlanLoad, PlanResponsibility, PlanWorkplace, PlanYear } from '@/types/models/plans';

import { PlanForm } from './plan-form';

interface Props {
  years: PlanYear[];
  workplaces: PlanWorkplace[];
  initialLoads: PlanLoad[];
}

export const PlansView = ({ years, workplaces, initialLoads }: Props) => {
  const t = useTranslations('private.plans');
  const [yearId, setYearId] = useState(years.find((year) => year.isCurrent)?.id ?? years[0]?.id ?? 0);
  const [semester, setSemester] = useState(0);
  const [workplaceId, setWorkplaceId] = useState(0);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'loads' | 'responsibilities'>('loads');
  const [loads, setLoads] = useState(initialLoads);
  const [responsibilities, setResponsibilities] = useState<PlanResponsibility[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editHours, setEditHours] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteActive, setDeleteActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState(1);
  const currentYearId = years.find((year) => year.isCurrent)?.id ?? years[0]?.id ?? 0;
  const canEdit = yearId === currentYearId;

  useEffect(() => {
    if (!yearId) {
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([getPlanLoads(yearId, semester), getPlanResponsibilities(yearId, semester)])
      .then(([nextLoads, nextResponsibilities]) => {
        if (active) {
          setLoads(nextLoads);
          setResponsibilities(nextResponsibilities);
        }
      })
      .catch(() => {
        if (active) {
          setError(t('requestError'));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [yearId, semester, t]);

  const refresh = async () => {
    const [nextLoads, nextResponsibilities] = await Promise.all([
      getPlanLoads(yearId, semester),
      getPlanResponsibilities(yearId, semester),
    ]);
    setLoads(nextLoads);
    setResponsibilities(nextResponsibilities);
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
  const filteredResponsibilities = useMemo(
    () =>
      responsibilities.filter((item) =>
        `${item.curriculumRow} ${item.group} ${item.teachers.map((teacher) => teacher.name).join(' ')}`
          .toLocaleLowerCase()
          .includes(query),
      ),
    [responsibilities, query],
  );
  const { sortedRows, sortHandlers } = useTableSort(filteredLoads, undefined, [
    'curriculumRow',
    'workplace',
    'semester',
    'group',
    'loadType',
    'plannedHours',
  ]);
  const visibleLoads = sortedRows.slice((page - 1) * PAGE_SIZE_DEFAULT, page * PAGE_SIZE_DEFAULT);
  const totalPages = Math.max(1, Math.ceil(filteredLoads.length / PAGE_SIZE_DEFAULT));
  const totalHours = filteredLoads.reduce((sum, load) => sum + load.plannedHours, 0);

  const run = async (action: () => Promise<{ ok: boolean; code?: string }>, success: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await action();
      if (!result.ok) {
        if (result.code === 'active-attestation') {
          setDeleteActive(true);
          return;
        }
        setError(result.code === 'completed-attestation' ? t('completedAttestation') : t('requestError'));
        return;
      }
      await refresh();
      setNotice(success);
      setEditId(null);
      setDeleteId(null);
      setDeleteActive(false);
    } catch {
      setError(t('requestError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="small"
            variant={tab === 'loads' ? 'primary' : 'secondary'}
            onClick={() => setTab('loads')}
          >
            {t('workloads')}
          </Button>
          <Button
            type="button"
            size="small"
            variant={tab === 'responsibilities' ? 'primary' : 'secondary'}
            onClick={() => setTab('responsibilities')}
          >
            {t('responsibility')}
          </Button>
        </div>
        {canEdit && tab === 'loads' && !showForm && (
          <Button type="button" size="small" icon={<Plus />} onClick={() => setShowForm(true)}>
            {t('addLoad')}
          </Button>
        )}
      </div>

      {showForm && (
        <PlanForm
          workplaces={workplaces}
          onCancel={() => setShowForm(false)}
          onSaved={async () => {
            await refresh();
            setShowForm(false);
            setNotice(t('saved'));
          }}
        />
      )}

      <div className="mb-5 grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium">
          {t('year')}
          <Select
            value={String(yearId)}
            onValueChange={(value) => {
              setYearId(Number(value));
              setPage(1);
              setShowForm(false);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.id} value={String(year.id)}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {t('semester')}
          <Select
            value={String(semester)}
            onValueChange={(value) => {
              setSemester(Number(value));
              setPage(1);
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
        {tab === 'loads' && (
          <label className="grid gap-1 text-sm font-medium">
            {t('workplace')}
            <Select
              value={String(workplaceId)}
              onValueChange={(value) => {
                setWorkplaceId(Number(value));
                setPage(1);
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
        )}
        <label className="grid gap-1 text-sm font-medium">
          {t('search')}
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
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

      {tab === 'loads' ? (
        <>
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
                  <TableHead sortHandlers={sortHandlers} sortHeader="curriculumRow">
                    {t('curriculumRow')}
                  </TableHead>
                  <TableHead sortHandlers={sortHandlers} sortHeader="workplace">
                    {t('workplace')}
                  </TableHead>
                  <TableHead sortHandlers={sortHandlers} sortHeader="semester">
                    {t('semester')}
                  </TableHead>
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
                {visibleLoads.map((load) => (
                  <TableRow key={load.id}>
                    <TableCell className="min-w-56 font-medium">{load.curriculumRow}</TableCell>
                    <TableCell>{load.workplace}</TableCell>
                    <TableCell>{load.semester === 1 ? t('firstSemester') : t('secondSemester')}</TableCell>
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
                                disabled={editHours === '' || Number(editHours) < 0 || Number(editHours) > 1000}
                                onClick={() => run(() => updatePlanHours(load.id, Number(editHours)), t('saved'))}
                              >
                                {t('save')}
                              </Button>
                              <Button type="button" size="small" variant="tertiary" onClick={() => setEditId(null)}>
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
          )}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-3 text-sm">
              <Button
                type="button"
                size="small"
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                {t('previous')}
              </Button>
              <span>{t('pageOf', { page, pages: totalPages })}</span>
              <Button
                type="button"
                size="small"
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                {t('next')}
              </Button>
            </div>
          )}
        </>
      ) : filteredResponsibilities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-14 text-center">
          <Paragraph className="my-0 text-sm text-neutral-600">{t('emptyResponsibilities')}</Paragraph>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('curriculumRow')}</TableHead>
              <TableHead>{t('groups')}</TableHead>
              <TableHead>{t('semester')}</TableHead>
              <TableHead>{t('responsibleTeacher')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResponsibilities.map((item) => (
              <TableRow key={`${item.curriculumRowId}-${item.semester}-${item.groupId}`}>
                <TableCell className="min-w-56 font-medium">{item.curriculumRow}</TableCell>
                <TableCell>{item.group}</TableCell>
                <TableCell>{item.semester === 1 ? t('firstSemester') : t('secondSemester')}</TableCell>
                <TableCell className="min-w-52">
                  {item.teachers.length === 1 ? (
                    item.teachers[0].name
                  ) : (
                    <Select
                      value={item.teachers.find((teacher) => teacher.isResponsible)?.employeeId.toString()}
                      disabled={!canEdit || busy}
                      onValueChange={(value) =>
                        run(
                          () => setPlanResponsible(item.curriculumRowId, item.semester, item.groupId, Number(value)),
                          t('saved'),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('chooseTeacher')} />
                      </SelectTrigger>
                      <SelectContent>
                        {item.teachers.map((teacher) => (
                          <SelectItem key={teacher.employeeId} value={String(teacher.employeeId)}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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
