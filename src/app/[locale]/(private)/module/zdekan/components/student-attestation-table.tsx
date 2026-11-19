import { useTranslations } from 'next-intl';

import { type getDeanOfficeStudent } from '@/actions/dean-office.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const columns = ['studyYear', 'semester', 'discipline', 'lecturer', 'assessment', 'result'] as const;

export function StudentAttestationTable({
  attestations,
}: {
  attestations: NonNullable<Awaited<ReturnType<typeof getDeanOfficeStudent>>>['attestations'];
}) {
  const t = useTranslations('private.dean-office');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{t(column)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {attestations.length ? (
          attestations.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.studyYear ?? '—'}</TableCell>
              <TableCell>{row.semester ?? '—'}</TableCell>
              <TableCell>{row.discipline ?? '—'}</TableCell>
              <TableCell>{row.lecturer ?? '—'}</TableCell>
              <TableCell>{row.assessment ?? '—'}</TableCell>
              <TableCell>{row.result ? t(`attestationStatuses.${row.result}`) : '—'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
