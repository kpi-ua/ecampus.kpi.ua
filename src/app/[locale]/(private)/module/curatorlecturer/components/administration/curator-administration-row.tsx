'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/empty-value';

import { CuratorAssignmentPanel } from './curator-assignment-panel';

interface Props {
  group: CuratorGroup;
  lecturers: CuratorLecturer[];
  expanded: boolean;
  onToggle: () => void;
}

export const CuratorAdministrationRow = ({ group, lecturers, expanded, onToggle }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');

  return (
    <Fragment>
      <TableRow>
        <TableCell className="font-semibold">{group.name}</TableCell>
        <TableCell>{group.course}</TableCell>
        <TableCell>{group.curatorName ?? t('not-assigned')}</TableCell>
        <TableCell>{group.description || EMPTY_VALUE}</TableCell>
        <TableCell>{group.departmentAbbreviation || group.departmentName}</TableCell>
        <TableCell>
          <Button variant="tertiary" size="small" onClick={onToggle}>
            <Show when={expanded} fallback={<ChevronDown className="size-4" />}>
              <ChevronUp className="size-4" />
            </Show>
          </Button>
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        <TableRow>
          <TableCell colSpan={6} className="bg-neutral-50 p-5">
            <CuratorAssignmentPanel group={group} lecturers={lecturers} />
          </TableCell>
        </TableRow>
      </Show>
    </Fragment>
  );
};
