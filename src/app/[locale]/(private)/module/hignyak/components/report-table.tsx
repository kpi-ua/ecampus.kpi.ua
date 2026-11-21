import { getTranslations } from 'next-intl/server';
import { type ReactNode } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMPTY_VALUE } from '@/lib/constants/common';

export async function ReportTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: { id: string | number; cells: ReactNode[] }[];
}) {
  const t = await getTranslations('private.dnvr-reporting');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={headers.length}>{t('empty')}</TableCell>
          </TableRow>
        )}
        {rows.map(({ id, cells }) => (
          <TableRow key={id}>
            {cells.map((cell, index) => (
              <TableCell key={headers[index]}>{cell ?? EMPTY_VALUE}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
