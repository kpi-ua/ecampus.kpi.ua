'use client';

import { type ReactNode, useId, useState } from 'react';

import { TableCell, TableRow } from '@/components/ui/table';
import { TableExpandButton } from '@/components/ui/table-expand-button';

export function LecturerSurveyRow({
  lecturer,
  scores,
  children,
}: {
  lecturer: string;
  scores: (string | number)[];
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  return (
    <>
      <TableRow>
        <TableCell>{lecturer}</TableCell>
        {scores.map((score, index) => (
          <TableCell key={index}>{score}</TableCell>
        ))}
        <TableCell>
          <TableExpandButton
            expanded={expanded}
            onToggle={() => setExpanded((value) => !value)}
            label={lecturer}
            controls={detailsId}
          />
        </TableCell>
      </TableRow>
      <TableRow id={detailsId} hidden={!expanded}>
        <TableCell colSpan={scores.length + 2}>{expanded && children}</TableCell>
      </TableRow>
    </>
  );
}
