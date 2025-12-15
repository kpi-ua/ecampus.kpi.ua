'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatNumber, linkifyText } from '@/lib/utils';
import { RatingEntry } from '@/types/models/rating';
import { EntriesTableProps, GroupedByWorkKind, TreeGroup } from '../types';

export function EntriesTable({ entries }: EntriesTableProps) {
  const t = useTranslations('private.rating');
  const [expandedTreeGroups, setExpandedTreeGroups] = useState<Set<string>>(new Set());

  const toggleTreeGroup = (key: string) => {
    setExpandedTreeGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const groupedEntries = useMemo(() => {
    // First, group by workKindId
    const workKindGroups: Map<number, { workKindName: string; entries: RatingEntry[] }> = new Map();

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

    // Then, within each workKind, group by treeName
    const result: GroupedByWorkKind[] = [];

    workKindGroups.forEach((group, workKindId) => {
      const treeGroups: Map<string, TreeGroup> = new Map();

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

  if (entries.length === 0) {
    return (
      <div className="py-4 text-center text-neutral-500">
        <p>{t('noEntries')}</p>
      </div>
    );
  }

  // Calculate global entry index for numbering
  const getGlobalIndex = (workKindGroup: GroupedByWorkKind, treeGroupIndex: number, entryIndex: number) => {
    let count = 0;
    for (let i = 0; i < treeGroupIndex; i++) {
      count += workKindGroup.treeGroups[i].entries.length;
    }
    return count + entryIndex + 1;
  };

  return (
    <div>
      {groupedEntries.map((workKindGroup, workKindIndex) => (
        <div key={workKindGroup.workKindId} className={workKindIndex > 0 ? 'mt-10' : ''}>
          <div className="mb-3">
            <span className="font-semibold">{workKindGroup.workKindName}:</span>{' '}
            <span className="text-neutral-600">
              {formatNumber(workKindGroup.totalResult)} {t('points')}
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">№</TableHead>
                  <TableHead>{t('table.workType')}</TableHead>
                  <TableHead className="w-24 whitespace-nowrap text-right">{t('table.mark')}</TableHead>
                  <TableHead className="w-24 whitespace-nowrap text-right">{t('table.quantity')}</TableHead>
                  <TableHead className="w-24 whitespace-nowrap text-right">{t('table.percent')}</TableHead>
                  <TableHead className="w-24 whitespace-nowrap text-right">{t('table.result')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workKindGroup.treeGroups.map((treeGroup, treeGroupIndex) => {
                  const treeGroupKey = `${workKindGroup.workKindId}-${treeGroup.treeName}`;
                  const isExpanded = expandedTreeGroups.has(treeGroupKey);

                  return (
                    <React.Fragment key={treeGroupKey}>
                      {/* Tree name header row - collapsible */}
                      <TableRow
                        className="cursor-pointer bg-neutral-50 hover:bg-neutral-100"
                        onClick={() => toggleTreeGroup(treeGroupKey)}
                      >
                        <TableCell colSpan={6} className="py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </span>
                            <span className="font-semibold">{treeGroup.treeName}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {/* Individual entries - only shown when expanded */}
                      {isExpanded &&
                        treeGroup.entries.map((entry, entryIndex) => (
                          <TableRow key={entry.ratingTextId} className="align-top">
                            <TableCell className="font-medium">
                              {getGlobalIndex(workKindGroup, treeGroupIndex, entryIndex)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <span className="font-medium">{entry.loadName}</span>
                                {entry.textFull && (
                                  <>
                                    <br />
                                    <span className="whitespace-pre-wrap text-sm text-neutral-600">
                                      {linkifyText(entry.textFull)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(entry.mark)}</TableCell>
                            <TableCell className="text-right">{formatNumber(entry.quantity)}</TableCell>
                            <TableCell className="text-right">{formatNumber(entry.quantityPercent)}%</TableCell>
                            <TableCell className="text-basic-blue text-right font-medium">
                              {formatNumber(entry.result)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
