import { useTranslations } from 'next-intl';

import { type getDeanOfficePersonnel } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

const columns = ['name', 'document', 'date', 'position', 'startsAt', 'endsAt', 'employment', 'stake'] as const;

export function EmployeePersonnelTable({
  personnel,
}: {
  personnel: Awaited<ReturnType<typeof getDeanOfficePersonnel>>;
}) {
  const t = useTranslations('private.dean-office');
  const date = (value: string | null) => (value ? formatDate(value) : '—');
  const rows = personnel ?? [];
  return (
    <div className="pt-4">
      <h2 className="mb-4 text-xl font-semibold">{t('personnel')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.fullName ?? '—'}</TableCell>
                <TableCell>{row.documentNumber ?? '—'}</TableCell>
                <TableCell>{date(row.documentDate)}</TableCell>
                <TableCell>{row.position ?? '—'}</TableCell>
                <TableCell>{date(row.positionDateStart)}</TableCell>
                <TableCell>{date(row.positionDateEnd)}</TableCell>
                <TableCell>{row.workOrgForm ?? '—'}</TableCell>
                <TableCell>{row.stake ?? '—'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{personnel ? t('empty') : t('personnelUnavailable')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
