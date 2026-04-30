'use client';

import { useId, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { SbpLoadCatalogItem } from '@/types/models/sbp-rights';

interface Props {
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
 * is held in the parent form (array of loadIds).
 */
export function LoadMultiSelect({ loads, value, onChange }: Props) {
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

  if (groups.length === 0) {
    return <p className="text-muted-foreground text-sm">{t('loadsNotFound')}</p>;
  }

  return (
    <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border p-3">
      {groups.map((group) => (
        <div key={`${group.workKindId}:${group.treeId}`}>
          <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
            {group.workKindName} · {group.treeName}
          </div>
          <div className="flex flex-col gap-2">
            {group.loads.map((load) => {
              const id = `${idPrefix}-${load.loadId}`;
              return (
                <label
                  key={load.loadId}
                  htmlFor={id}
                  className="flex cursor-pointer items-start gap-2 text-sm"
                >
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
                  <span className="text-muted-foreground text-xs">{load.mark}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
