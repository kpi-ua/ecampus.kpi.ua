import { useMemo } from 'react';
import { RatingEntry } from '@/types/models/rating';
import { GroupedByWorkKind, TreeGroup } from '../types';

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

      const treeGroupsArray = Array.from(treeGroups.values()).sort((a, b) => a.treeId - b.treeId);
      const totalResult = group.entries.reduce((sum, e) => sum + e.result, 0);

      result.push({
        workKindId,
        workKindName: group.workKindName,
        treeGroups: treeGroupsArray,
        totalResult,
      });
    });

    return result.sort((a, b) => a.workKindId - b.workKindId);
  }, [entries]);
}
