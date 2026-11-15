'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { createPlanLoads, getPlanCatalog, getPlanGroups } from '@/actions/plans.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlanCatalog, PlanOption, PlanWorkplace } from '@/types/models/plans';

interface Props {
  workplaces: PlanWorkplace[];
  onCancel: () => void;
  onSaved: () => Promise<void>;
}

export const PlanForm = ({ workplaces, onCancel, onSaved }: Props) => {
  const t = useTranslations('private.plans');
  const [workplaceId, setWorkplaceId] = useState<number | null>(null);
  const [semester, setSemester] = useState(1);
  const [catalog, setCatalog] = useState<PlanCatalog | null>(null);
  const [rowId, setRowId] = useState<number | null>(null);
  const [groups, setGroups] = useState<PlanOption[]>([]);
  const [groupIds, setGroupIds] = useState<number[]>([]);
  const [loadTypeId, setLoadTypeId] = useState<number | null>(null);
  const [hours, setHours] = useState('');
  const [rowSearch, setRowSearch] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!workplaceId) {
      return;
    }
    let active = true;
    getPlanCatalog(workplaceId)
      .then((result) => {
        if (active) {
          setCatalog(result);
        }
      })
      .catch(() => {
        if (active) {
          setError(t('requestError'));
        }
      });
    return () => {
      active = false;
    };
  }, [workplaceId, t]);

  useEffect(() => {
    if (!workplaceId || !rowId) {
      return;
    }
    let active = true;
    getPlanGroups(workplaceId, rowId)
      .then((result) => {
        if (active) {
          setGroups(result);
        }
      })
      .catch(() => {
        if (active) {
          setError(t('requestError'));
        }
      });
    return () => {
      active = false;
    };
  }, [workplaceId, rowId, t]);

  const visibleRows = useMemo(() => {
    const query = rowSearch.trim().toLocaleLowerCase();
    return (catalog?.curriculumRows ?? []).filter((row) =>
      `${row.name} ${row.department} ${row.program} ${row.studyForm}`.toLocaleLowerCase().includes(query),
    );
  }, [catalog, rowSearch]);

  const selectedRow = catalog?.curriculumRows.find((row) => row.id === rowId);
  const validHours =
    hours.trim() !== '' && Number.isFinite(Number(hours)) && Number(hours) >= 0 && Number(hours) <= 1000;
  const canSave = workplaceId && rowId && loadTypeId && groupIds.length > 0 && validHours;

  const save = async () => {
    if (!canSave) {
      setError(t('completeFields'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await createPlanLoads({
        workplaceId,
        curriculumRowId: rowId,
        semester,
        loadTypeId,
        groupIds,
        plannedHours: Number(hours),
      });
      if (!result.ok) {
        setError(t('requestError'));
        return;
      }
      if (result.created === 0) {
        setError(t('alreadyExists'));
        return;
      }
      await onSaved();
    } catch {
      setError(t('requestError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {t('workplace')}
          <Select
            value={workplaceId?.toString()}
            onValueChange={(value) => {
              setWorkplaceId(Number(value));
              setCatalog(null);
              setRowId(null);
              setGroups([]);
              setGroupIds([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('chooseWorkplace')} />
            </SelectTrigger>
            <SelectContent>
              {workplaces.map((workplace) => (
                <SelectItem key={workplace.id} value={String(workplace.id)}>
                  {workplace.name} · {workplace.duties}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t('semester')}
          <Select value={String(semester)} onValueChange={(value) => setSemester(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t('firstSemester')}</SelectItem>
              <SelectItem value="2">{t('secondSemester')}</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      {workplaceId && (
        <div className="mt-5 grid gap-5">
          <label className="grid gap-2 text-sm font-medium">
            {t('curriculumRow')}
            <Input
              value={rowSearch}
              onChange={(event) => setRowSearch(event.target.value)}
              placeholder={t('searchCurriculum')}
            />
          </label>
          <Select
            value={rowId?.toString()}
            onValueChange={(value) => {
              setRowId(Number(value));
              setGroups([]);
              setGroupIds([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('chooseCurriculum')} />
            </SelectTrigger>
            <SelectContent>
              {visibleRows.map((row) => (
                <SelectItem key={row.id} value={String(row.id)}>
                  {row.name} · {row.program} · {row.studyForm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRow && (
            <Paragraph className="my-0 text-sm text-neutral-600">
              {selectedRow.department} · {selectedRow.program} · {selectedRow.studyForm}
            </Paragraph>
          )}
        </div>
      )}
      {rowId && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{t('groups')}</span>
              {groups.length > 0 && (
                <Button
                  type="button"
                  size="small"
                  variant="tertiary"
                  onClick={() => setGroupIds(groupIds.length === groups.length ? [] : groups.map((g) => g.id))}
                >
                  {groupIds.length === groups.length ? t('clearAll') : t('selectAll')}
                </Button>
              )}
            </div>
            <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg border border-neutral-200 p-3">
              {groups.length === 0 && <Paragraph className="my-0 text-sm text-neutral-500">{t('noGroups')}</Paragraph>}
              {groups.map((group) => (
                <label key={group.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={groupIds.includes(group.id)}
                    onCheckedChange={(checked) =>
                      setGroupIds((ids) => (checked ? [...ids, group.id] : ids.filter((id) => id !== group.id)))
                    }
                  />
                  {group.name}
                </label>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-5">
            <label className="grid gap-2 text-sm font-medium">
              {t('loadType')}
              <Select value={loadTypeId?.toString()} onValueChange={(value) => setLoadTypeId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('chooseLoadType')} />
                </SelectTrigger>
                <SelectContent>
                  {(catalog?.loadTypes ?? []).map((loadType) => (
                    <SelectItem key={loadType.id} value={String(loadType.id)}>
                      {loadType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {t('plannedHours')}
              <Input
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
              />
            </label>
          </div>
        </div>
      )}
      {error && (
        <Paragraph className="my-4 text-sm text-red-700" role="alert">
          {error}
        </Paragraph>
      )}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="button" loading={saving} disabled={!canSave} onClick={save}>
          {t('saveLoads')}
        </Button>
      </div>
    </div>
  );
};
