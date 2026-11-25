import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo, useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type PlanLoad } from '@/types/models/plans';

import { type WorkloadTableActions, WorkloadsSubtable } from './workloads-subtable';

interface Props {
  loads: PlanLoad[];
  actions: WorkloadTableActions;
}

export const WorkloadsTable = ({ loads, actions }: Props) => {
  const t = useTranslations('private.plans');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const handleToggleGroup = (key: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const groupedLoads = useMemo(() => {
    const groups = new Map<string, PlanLoad[]>();
    for (const load of loads) {
      const key = `${load.workplaceId}-${load.curriculumRowId}-${load.semester}`;
      const entries = groups.get(key) ?? [];
      entries.push(load);
      groups.set(key, entries);
    }
    return [...groups.entries()].map(([key, entries]) => ({ key, entries, first: entries[0] }));
  }, [loads]);
  const totalHours = loads.reduce((sum, load) => sum + load.plannedHours, 0);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-5 text-sm text-neutral-600">
        <span>{t('recordsCount', { count: loads.length })}</span>
        <span>{t('hoursTotal', { hours: totalHours.toLocaleString() })}</span>
      </div>
      {loads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-14 text-center">
          <Paragraph className="my-0 text-sm text-neutral-600">{t('emptyLoads')}</Paragraph>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('curriculumRow')}</TableHead>
              <TableHead>{t('workplace')}</TableHead>
              <TableHead>{t('semester')}</TableHead>
              <TableHead>{t('groups')}</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">{t('expandGroup')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedLoads.map((section) => (
              <Fragment key={section.key}>
                <TableRow>
                  <TableCell className="font-medium">{section.first.curriculumRow}</TableCell>
                  <TableCell>{section.first.workplace}</TableCell>
                  <TableCell>{section.first.semester === 1 ? t('firstSemester') : t('secondSemester')}</TableCell>
                  <TableCell>
                    {[...new Set(section.entries.map((load) => load.group))]
                      .sort((a, b) => a.localeCompare(b))
                      .join(', ')}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-md hover:bg-neutral-100 focus-visible:outline-2"
                      aria-expanded={expandedGroups.has(section.key)}
                      aria-label={t(expandedGroups.has(section.key) ? 'collapseGroup' : 'expandGroup')}
                      onClick={() => handleToggleGroup(section.key)}
                    >
                      {expandedGroups.has(section.key) ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
                {expandedGroups.has(section.key) && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-neutral-50 p-4">
                      <WorkloadsSubtable loads={section.entries} {...actions} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
