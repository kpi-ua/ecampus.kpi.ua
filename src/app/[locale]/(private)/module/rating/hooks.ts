import { useMemo } from 'react';
import { sort, sum } from 'radash';
import { RatingEntry } from '@/types/models/rating';
import { GroupedByWorkKind, TreeGroup } from './types';

export function useGroupedEntries(entries: RatingEntry[]): GroupedByWorkKind[] {
  return useMemo(() => {
    const workKindGroups = new Map<number, { workKindName: string; entries: RatingEntry[] }>();

    entries.forEach((entry) => {
      const existing = workKindGroups.get(entry.workKindId);
      if (existing) {
        existing.entries.push(entry);
      } else {
        workKindGroups.set(entry.workKindId, {
          workKindName: entry.workKindName,
          entries: [entry],
        });
      }
    });

    const result: GroupedByWorkKind[] = [];

    workKindGroups.forEach((group, workKindId) => {
      const treeGroups = new Map<string, TreeGroup>();

      group.entries.forEach((entry) => {
        const key = entry.treeName;
        const existing = treeGroups.get(key);
        if (existing) {
          existing.entries.push(entry);
        } else {
          treeGroups.set(key, {
            treeName: entry.treeName,
            treeId: entry.treeId,
            entries: [entry],
          });
        }
      });

      const treeGroupsArray = sort(Array.from(treeGroups.values()), (t) => t.treeId);
      const totalResult = sum(group.entries, (e) => e.result);

      result.push({
        workKindId,
        workKindName: group.workKindName,
        treeGroups: treeGroupsArray,
        totalResult,
      });
    });

    return sort(result, (r) => r.workKindId);
  }, [entries]);
}
