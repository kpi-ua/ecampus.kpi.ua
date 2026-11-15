'use client';

import { useTranslations } from 'next-intl';
import { ComponentProps, useId, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { SbpLoadCatalogItem } from '@/types/models/sbp-rights';

interface Props extends Omit<ComponentProps<'div'>, 'onChange'> {
  loads: SbpLoadCatalogItem[];
  value: number[];
  onChange: (next: number[]) => void;
}

interface Group {
  workKindId: number;
  workKindName: string;
  treeId: number;
  treeName: string;
  loads: SbpLoadCatalogItem[];
}

/**
 * Flat checkbox list of SBP loads, grouped by work-kind → tree. Selection
 * is held in the parent form (array of loadIds). A global and per-group
 * Select-all / Clear toggle (KB-1307) avoids hand-checking long lists.
 * Remaining props (id, aria-* from `FormControl`) go to the checkbox group,
 * so the required-field error is tied to it.
 */
export function LoadMultiSelect({ loads, value, onChange, className, ...groupProps }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const idPrefix = useId();

  const groups = useMemo<Group[]>(() => {
    const map = new Map<string, Group>();
    for (const load of loads) {
      const key = `${load.workKindId}:${load.treeId}`;
      let group = map.get(key);
      if (!group) {
        group = {
          workKindId: load.workKindId,
          workKindName: load.workKindName,
          treeId: load.treeId,
          treeName: load.treeName,
          loads: [],
        };
        map.set(key, group);
      }
      group.loads.push(load);
    }
    return [...map.values()];
  }, [loads]);

  const selected = new Set(value);

  const toggle = (loadId: number) => {
    onChange(selected.has(loadId) ? value.filter((id) => id !== loadId) : [...value, loadId]);
  };

  const allLoadIds = useMemo(() => loads.map((l) => l.loadId), [loads]);
  const allSelected = allLoadIds.length > 0 && allLoadIds.every((id) => selected.has(id));

  const toggleAll = () => {
    onChange(allSelected ? [] : allLoadIds);
  };

  const toggleGroup = (group: Group, allInGroup: boolean) => {
    const groupIds = group.loads.map((l) => l.loadId);
    if (allInGroup) {
      const groupSet = new Set(groupIds);
      onChange(value.filter((id) => !groupSet.has(id)));
    } else {
      onChange([...new Set([...value, ...groupIds])]);
    }
  };

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('loadsNotFound')}</p>;
  }

  return (
    <div {...groupProps} role="group" aria-label={t('loads')} className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{t('loadsSelected', { count: value.length })}</span>
        <Button type="button" variant="tertiary" size="small" onClick={toggleAll} className="px-2 py-1 text-xs">
          {allSelected ? t('clearAll') : t('selectAll')}
        </Button>
      </div>
      <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border p-3">
        {groups.map((group) => {
          const allInGroup = group.loads.every(({ loadId }) => selected.has(loadId));
          return (
            <div key={`${group.workKindId}:${group.treeId}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.workKindName} · {group.treeName}
                </div>
                <Button
                  type="button"
                  variant="tertiary"
                  size="small"
                  onClick={() => toggleGroup(group, allInGroup)}
                  className="px-2 py-1 text-xs"
                >
                  {allInGroup ? t('clearAll') : t('selectAll')}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {group.loads.map((load) => {
                  const id = `${idPrefix}-${load.loadId}`;
                  return (
                    <label key={load.loadId} htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm">
                      <Checkbox
                        id={id}
                        checked={selected.has(load.loadId)}
                        onCheckedChange={() => toggle(load.loadId)}
                        className="mt-0.5"
                      />
                      <span className="flex-1">
                        {load.subTreeNumber != null ? `${load.subTreeNumber}. ` : ''}
                        {load.loadName}
                      </span>
                      <span className="text-xs text-muted-foreground">{load.mark}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
