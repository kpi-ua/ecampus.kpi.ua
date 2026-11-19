import { getTranslations } from 'next-intl/server';

import { Heading2 } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { type PersonnelEmployment } from '@/types/models/dean-office';

export async function EmployeePersonnelTable({ personnel }: { personnel: PersonnelEmployment[] | null }) {
  const t = await getTranslations('private.dean-office');
  const rows = personnel ?? [];
  return (
    <div className="pt-4">
      <Heading2 className="mb-4 text-xl leading-7 lg:text-xl lg:leading-7">{t('personnel')}</Heading2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('document')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('position')}</TableHead>
            <TableHead>{t('startsAt')}</TableHead>
            <TableHead>{t('endsAt')}</TableHead>
            <TableHead>{t('employment')}</TableHead>
            <TableHead>{t('stake')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show
            when={rows.length > 0}
            fallback={<TableEmptyRow colSpan={8}>{personnel ? t('empty') : t('personnelUnavailable')}</TableEmptyRow>}
          >
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.fullName ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.documentNumber ?? EMPTY_VALUE}</TableCell>
                <TableCell>{formatDate(row.documentDate) || EMPTY_VALUE}</TableCell>
                <TableCell>{row.position ?? EMPTY_VALUE}</TableCell>
                <TableCell>{formatDate(row.positionDateStart) || EMPTY_VALUE}</TableCell>
                <TableCell>{formatDate(row.positionDateEnd) || EMPTY_VALUE}</TableCell>
                <TableCell>{row.workOrgForm ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.stake ?? EMPTY_VALUE}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </div>
  );
}
