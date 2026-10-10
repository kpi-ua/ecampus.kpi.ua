'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LoadingRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/loading-row';
import { CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorAdministrationRow } from './curator-administration-row';

interface Props {
  groups: CuratorGroup[];
  lecturers: CuratorLecturer[];
  isFetching: boolean;
}

export const CuratorAdministrationTable = ({ groups, lecturers, isFetching }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  const handleToggle = (groupId: number) => {
    setExpandedGroupId((current) => (current === groupId ? null : groupId));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.group')}</TableHead>
          <TableHead>{t('table.course')}</TableHead>
          <TableHead>{t('table.curator')}</TableHead>
          <TableHead>{t('table.description')}</TableHead>
          <TableHead>{t('table.department')}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{t('table.actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Show when={!isFetching} fallback={<LoadingRow colSpan={6} />}>
          <Show
            when={groups.length > 0}
            fallback={
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-neutral-500">
                  {t('empty')}
                </TableCell>
              </TableRow>
            }
          >
            {groups.map((group) => (
              <CuratorAdministrationRow
                key={group.groupId}
                group={group}
                lecturers={lecturers}
                expanded={expandedGroupId === group.groupId}
                onToggle={() => handleToggle(group.groupId)}
              />
            ))}
          </Show>
        </Show>
      </TableBody>
    </Table>
  );
};
