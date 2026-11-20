'use client';

import { type ReactNode, useState } from 'react';

import { TableCell, TableRow } from '@/components/ui/table';
import { TableExpandButton } from '@/components/ui/table-expand-button';
import { Show } from '@/components/utils/show';

export function LecturerSurveyRow({
  lecturer,
  responses,
  average,
  weightedAverage,
  children,
}: {
  lecturer: string;
  responses: number;
  average: string;
  weightedAverage: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>{lecturer}</TableCell>
        <TableCell>{responses}</TableCell>
        <TableCell>{average}</TableCell>
        <TableCell>{weightedAverage}</TableCell>
        <TableCell>
          <TableExpandButton expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
        </TableCell>
      </TableRow>
      <TableRow hidden={!expanded}>
        <TableCell colSpan={5}>
          <Show when={expanded}>{children}</Show>
        </TableCell>
      </TableRow>
    </>
  );
}
