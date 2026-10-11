'use client';

import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';

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
      <TableRow className={expanded ? 'border-0 hover:bg-white' : undefined}>
        <TableCell className="font-normal">{group.name}</TableCell>
        <TableCell>{group.course}</TableCell>
        <TableCell>{group.curatorName ?? t('not-assigned')}</TableCell>
        <TableCell>{group.description || EMPTY_VALUE}</TableCell>
        <TableCell>{group.departmentAbbreviation || group.departmentName}</TableCell>
        <TableCell>
          <Button
            variant="tertiary"
            size="small"
            className="h-6 w-6 p-0"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={t(expanded ? 'collapse' : 'expand')}
          >
            <span
              aria-hidden="true"
              className={
                expanded
                  ? 'border-x-[8px] border-t-[8px] border-x-transparent border-t-black'
                  : 'border-x-[8px] border-b-[8px] border-x-transparent border-b-black'
              }
            />
          </Button>
        </TableCell>
      </TableRow>
      <Show when={expanded}>
        <TableRow className="border-0 hover:bg-white">
          <TableCell colSpan={6} className="!px-0 !pt-0 !pb-2">
            <CuratorAssignmentPanel group={group} lecturers={lecturers} />
          </TableCell>
        </TableRow>
      </Show>
    </Fragment>
  );
};
