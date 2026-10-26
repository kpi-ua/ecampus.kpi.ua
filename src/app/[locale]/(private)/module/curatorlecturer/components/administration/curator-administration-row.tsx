'use client';

import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { TableExpandButton } from '@/components/ui/table-expand-button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { CuratorAssignmentPanel } from './curator-assignment-panel';

interface Props {
  group: CuratorGroup;
  lecturers: CuratorLecturer[];
  academicYearStart: string;
  academicYearEnd: string;
  expanded: boolean;
  onToggle: () => void;
}

export const CuratorAdministrationRow = ({ group, lecturers, academicYearStart, academicYearEnd, expanded, onToggle }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');

  return (
    <Fragment>
      <TableRow className={expanded ? 'border-0 hover:bg-white' : undefined}>
        <TableCell className="font-normal">{group.name}</TableCell>
        <TableCell>{group.course}</TableCell>
        <TableCell>{group.curatorName ?? t('not-assigned')}</TableCell>
        <TableCell>{group.description || EMPTY_VALUE}</TableCell>
        <TableCell>{group.departmentAbbreviation || group.departmentName}</TableCell>
        <TableCell className="w-12 text-right">
          <TableExpandButton expanded={expanded} onToggle={onToggle} />
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        <TableRow className="border-0 hover:bg-white">
          <TableCell colSpan={6} className="!px-0 !pb-2 !pt-0">
            <CuratorAssignmentPanel
              group={group}
              lecturers={lecturers}
              academicYearStart={academicYearStart}
              academicYearEnd={academicYearEnd}
            />
          </TableCell>
        </TableRow>
      </Show>
    </Fragment>
  );
};
