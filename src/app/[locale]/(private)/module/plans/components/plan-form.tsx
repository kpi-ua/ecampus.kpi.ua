'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { unique } from 'radash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createPlanLoads, getPlanCatalog, getPlanGroups } from '@/actions/plans.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlanCatalog, PlanOption, PlanWorkplace } from '@/types/models/plans';

interface Props {
  workplaces: PlanWorkplace[];
  yearName: string;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}

interface DraftLoad {
  groupId: number;
  groupName: string;
  loadTypeId: number;
  loadTypeName: string;
  plannedHours: number;
}

const uniqueNames = (names: string[]) => unique(names).sort((a, b) => a.localeCompare(b));

export const PlanForm = ({ workplaces, yearName, onCancel, onSaved }: Props) => {
  const t = useTranslations('private.plans');
  const entrySchema = z.object({
    semester: z.number().int().min(1).max(2),
    workplaceId: z.number().positive(t('chooseWorkplace')),
    rowId: z.number().positive(t('chooseCurriculum')),
    loadTypeId: z.number().positive(t('chooseLoadType')),
    groupIds: z.array(z.number()).min(1, t('chooseGroups')),
    hours: z
      .string()
      .trim()
      .min(1, t('requiredHours'))
      .refine(
        (value) => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1000,
        t('invalidHours'),
      ),
  });
  type EntryValues = z.infer<typeof entrySchema>;
  const form = useForm<EntryValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: { workplaceId: 0, semester: 1, rowId: 0, groupIds: [], loadTypeId: 0, hours: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { workplaceId, semester, rowId, groupIds, loadTypeId, hours } = form.watch();
  const setField = (name: keyof EntryValues, value: EntryValues[keyof EntryValues]) => {
    form.setValue(name, value, { shouldValidate: form.formState.isSubmitted, shouldDirty: true });
  };
  const setWorkplaceId = (value: number | null) => setField('workplaceId', value ?? 0);
  const setSemester = (value: number) => setField('semester', value);
  const setRowId = (value: number | null) => setField('rowId', value ?? 0);
  const setLoadTypeId = (value: number | null) => setField('loadTypeId', value ?? 0);
  const setHours = (value: string) => setField('hours', value);
  const setGroupIds = (value: number[] | ((current: number[]) => number[])) =>
    setField('groupIds', typeof value === 'function' ? value(form.getValues('groupIds')) : value);
  const [catalog, setCatalog] = useState<PlanCatalog | null>(null);
  const [department, setDepartment] = useState('all');
  const [program, setProgram] = useState('all');
  const [studyForm, setStudyForm] = useState('all');
  const [rowSearch, setRowSearch] = useState('');
  const [groups, setGroups] = useState<PlanOption[]>([]);
  const [draft, setDraft] = useState<DraftLoad[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const contextLocked = draft.length > 0;

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

  const rows = useMemo(() => catalog?.curriculumRows ?? [], [catalog]);
  const departments = useMemo(() => uniqueNames(rows.map((row) => row.department)), [rows]);
  const programs = useMemo(
    () =>
      uniqueNames(
        rows.filter((row) => department === 'all' || row.department === department).map((row) => row.program),
      ),
    [rows, department],
  );
  const studyForms = useMemo(
    () =>
      uniqueNames(
        rows
          .filter(
            (row) =>
              (department === 'all' || row.department === department) && (program === 'all' || row.program === program),
          )
          .map((row) => row.studyForm),
      ),
    [rows, department, program],
  );
  const visibleRows = useMemo(() => {
    const query = rowSearch.trim().toLocaleLowerCase();
    return rows.filter(
      (row) =>
        (department === 'all' || row.department === department) &&
        (program === 'all' || row.program === program) &&
        (studyForm === 'all' || row.studyForm === studyForm) &&
        `${row.name} ${row.department} ${row.program} ${row.studyForm}`.toLocaleLowerCase().includes(query),
    );
  }, [rows, department, program, studyForm, rowSearch]);
  const fieldError = (name: keyof EntryValues) =>
    form.formState.errors[name]?.message ? (
      <span className="block text-sm font-normal text-red-700" role="alert">
        {form.formState.errors[name]?.message}
      </span>
    ) : null;
  const clearRow = () => {
    setRowId(null);
    setGroups([]);
    setGroupIds([]);
  };

  const addToDraft = form.handleSubmit(() => {
    if (
      groupIds.some((groupId) => draft.some((entry) => entry.groupId === groupId && entry.loadTypeId === loadTypeId))
    ) {
      setError(t('duplicateDraft'));
      return;
    }
    if (!loadTypeId) {
      return;
    }
    form.clearErrors();
    const loadType = catalog?.loadTypes.find((type) => type.id === loadTypeId);
    setDraft((current) => [
      ...current,
      ...groups
        .filter((group) => groupIds.includes(group.id))
        .map((group) => ({
          groupId: group.id,
          groupName: group.name,
          loadTypeId,
          loadTypeName: loadType?.name ?? '',
          plannedHours: Number(hours),
        })),
    ]);
    setGroupIds([]);
    setLoadTypeId(null);
    setHours('');
    setError('');
  });

  const clearForm = () => {
    form.reset();
    setWorkplaceId(null);
    setSemester(1);
    setCatalog(null);
    setDepartment('all');
    setProgram('all');
    setStudyForm('all');
    setRowSearch('');
    clearRow();
    setLoadTypeId(null);
    setHours('');
    setDraft([]);
    form.clearErrors();
    setError('');
  };

  const save = async () => {
    if (!workplaceId || !rowId || draft.length === 0) {
      setError(t('addDraftFirst'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await createPlanLoads({
        loads: draft.map((entry) => ({
          workplaceId,
          curriculumRowId: rowId,
          semester,
          loadTypeId: entry.loadTypeId,
          groupIds: [entry.groupId],
          plannedHours: entry.plannedHours,
        })),
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
    <div className="space-y-5">
      <fieldset className="rounded-lg border border-neutral-200 p-4">
        <legend className="px-2 text-sm font-semibold">{t('planDetails')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            {t('year')}
            <Input value={yearName} readOnly className="bg-neutral-50" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t('semester')}
            <Select
              value={String(semester)}
              disabled={contextLocked}
              onValueChange={(value) => setSemester(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t('firstSemester')}</SelectItem>
                <SelectItem value="2">{t('secondSemester')}</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1 text-sm font-medium sm:col-span-2">
            {t('workplace')}

            <Select
              value={workplaceId?.toString()}
              disabled={contextLocked}
              onValueChange={(value) => {
                setWorkplaceId(Number(value));
                setCatalog(null);
                setDepartment('all');
                setProgram('all');
                setStudyForm('all');
                clearRow();
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
            {fieldError('workplaceId')}
          </label>
        </div>
        {
          <div className="mt-5 space-y-4 border-t border-neutral-200 pt-4">
            <p className="text-sm font-semibold">{t('findCurriculum')}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-1 text-sm font-medium">
                {t('department')}
                <Select
                  value={department}
                  disabled={contextLocked}
                  onValueChange={(value) => {
                    setDepartment(value);
                    setProgram('all');
                    setStudyForm('all');
                    clearRow();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allDepartments')}</SelectItem>
                    {departments.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1 text-sm font-medium">
                {t('program')}
                <Select
                  value={program}
                  disabled={contextLocked}
                  onValueChange={(value) => {
                    setProgram(value);
                    setStudyForm('all');
                    clearRow();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allPrograms')}</SelectItem>
                    {programs.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1 text-sm font-medium">
                {t('studyForm')}
                <Select
                  value={studyForm}
                  disabled={contextLocked}
                  onValueChange={(value) => {
                    setStudyForm(value);
                    clearRow();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allStudyForms')}</SelectItem>
                    {studyForms.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <label className="grid gap-1 text-sm font-medium">
              {t('curriculumRow')}

              <Input
                value={rowSearch}
                disabled={contextLocked}
                onChange={(event) => setRowSearch(event.target.value)}
                placeholder={t('searchCurriculum')}
              />
              <Select
                value={rowId?.toString()}
                disabled={contextLocked}
                onValueChange={(value) => {
                  setRowId(Number(value));
                  setGroups([]);
                  setGroupIds([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('chooseCurriculum')} />
                </SelectTrigger>
                <SelectContent className="w-(--radix-select-trigger-width) max-w-[calc(100vw-2rem)]">
                  {visibleRows.map((row) => (
                    <SelectItem
                      key={row.id}
                      value={String(row.id)}
                      className="items-start py-2 [&>span:last-child]:min-w-0 [&>span:last-child]:break-words [&>span:last-child]:whitespace-normal"
                    >
                      {row.name} · {row.program} · {row.studyForm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError('rowId')}
            </label>
          </div>
        }
      </fieldset>

      {
        <fieldset className="rounded-lg border border-neutral-200 p-4">
          <legend className="px-2 text-sm font-semibold">{t('loadAssignments')}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{t('groups')}</span>
                {groups.length > 0 && (
                  <Button
                    type="button"
                    size="small"
                    variant="tertiary"
                    onClick={() =>
                      setGroupIds(groupIds.length === groups.length ? [] : groups.map((group) => group.id))
                    }
                  >
                    {groupIds.length === groups.length ? t('clearAll') : t('selectAll')}
                  </Button>
                )}
              </div>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-neutral-200 p-3">
                {groups.length === 0 && (
                  <Paragraph className="my-0 text-sm text-neutral-500">{t('noGroups')}</Paragraph>
                )}
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
              {fieldError('groupIds')}
            </div>
            <div className="grid content-start gap-4">
              <label className="grid gap-1 text-sm font-medium">
                {t('loadType')}

                <Select value={loadTypeId?.toString()} onValueChange={(value) => setLoadTypeId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('chooseLoadType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalog?.loadTypes ?? []).map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError('loadTypeId')}
              </label>
              <label className="grid gap-1 text-sm font-medium">
                {t('plannedHours')}

                <Input
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                />
                {fieldError('hours')}
              </label>
              <Button type="button" variant="secondary" disabled={saving} onClick={addToDraft}>
                {t('addEntry')}
              </Button>
            </div>
          </div>
        </fieldset>
      }

      {draft.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('draftAssignments', { count: draft.length })}</p>
          <div className="max-h-48 overflow-y-auto rounded-md border border-neutral-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('groups')}</TableHead>
                  <TableHead>{t('loadType')}</TableHead>
                  <TableHead>{t('plannedHours')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draft.map((entry) => (
                  <TableRow key={`${entry.groupId}-${entry.loadTypeId}`}>
                    <TableCell>{entry.groupName}</TableCell>
                    <TableCell>{entry.loadTypeName}</TableCell>
                    <TableCell>{entry.plannedHours.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="small"
                        variant="tertiary"
                        icon={<Trash2 />}
                        title={t('removeDraft')}
                        onClick={() => setDraft((items) => items.filter((item) => item !== entry))}
                      >
                        {t('delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {error && (
        <Paragraph className="my-0 text-sm text-red-700" role="alert">
          {error}
        </Paragraph>
      )}
      <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-200 pt-4">
        <Button type="button" variant="tertiary" disabled={saving} onClick={clearForm}>
          {t('clearDraft')}
        </Button>
        <Button type="button" variant="secondary" disabled={saving} onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="button" loading={saving} disabled={draft.length === 0} onClick={save}>
          {t('saveLoads')}
        </Button>
      </div>
    </div>
  );
};
