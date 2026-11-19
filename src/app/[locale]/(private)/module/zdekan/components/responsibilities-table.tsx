import { useTranslations } from 'next-intl';

import { type getDeanOfficeResponsibilities } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const columns = ['subsystem', 'department', 'responsiblePerson'] as const;

export function ResponsibilitiesTable({
  responsibilities,
}: {
  responsibilities: Awaited<ReturnType<typeof getDeanOfficeResponsibilities>>;
}) {
  const t = useTranslations('private.dean-office');
  return (
    <div className="pt-4">
      <h2 className="mb-4 text-xl font-semibold">{t('responsibilities')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responsibilities.length ? (
            responsibilities.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name ?? '—'}</TableCell>
                <TableCell>{row.department ?? '—'}</TableCell>
                <TableCell>{row.responsiblePerson ?? '—'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
