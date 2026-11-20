import { getDeansOfficeReport } from '@/actions/deans-office.actions';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { type DeansOfficeOption } from '@/types/models/deans-office';

import { DeansOfficeSelect } from '../../components/deans-office-select';
import { ExportButton } from '../../components/export-button';
import { type DeansOfficeTranslations } from '../../translations';

export async function AttestationReport({
  t,
  periodTypes,
  semester,
  periodTypeId,
}: {
  t: DeansOfficeTranslations;
  periodTypes: DeansOfficeOption[];
  semester: number;
  periodTypeId: number | null;
}) {
  const rows = periodTypeId ? await getDeansOfficeReport(null, semester, periodTypeId) : [];

  return (
    <>
      <div className="flex w-full flex-wrap items-end gap-x-4 gap-y-3">
        <div className="grid min-w-0 grid-cols-2 items-end gap-4 max-sm:w-full">
          <DeansOfficeSelect
            name="semester"
            value={semester}
            label={t('semester')}
            options={[
              { id: 1, name: t('firstSemester') },
              { id: 2, name: t('secondSemester') },
            ]}
          />
          <DeansOfficeSelect name="periodTypeId" value={periodTypeId} label={t('attestation')} options={periodTypes} />
        </div>
        <Show when={rows.length > 0}>
          <div className="ml-auto shrink-0">
            <ExportButton kind="reports" label={t('export')} query={{ semester, periodTypeId }} />
          </div>
        </Show>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('course')}</TableHead>
            <TableHead>{t('educationLevel')}</TableHead>
            <TableHead>{t('groupCount')}</TableHead>
            <TableHead>{t('studentCount')}</TableHead>
            <TableHead>{t('attested')}</TableHead>
            <TableHead>{t('notAttested')}</TableHead>
            <TableHead>{t('threeOrMoreFailures')}</TableHead>
            <TableHead>{t('oneOrTwoFailures')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={rows.length > 0} fallback={<TableEmptyRow colSpan={8}>{t('empty')}</TableEmptyRow>}>
            {rows.map((row) => (
              <TableRow key={`${row.course}-${row.educationLevel}`}>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.educationLevel}</TableCell>
                <TableCell>{row.groupCount}</TableCell>
                <TableCell>{row.studentCount}</TableCell>
                <TableCell>{row.attestedCount}</TableCell>
                <TableCell>{row.notAttestedCount}</TableCell>
                <TableCell>{row.threeOrMoreFailuresCount}</TableCell>
                <TableCell>{row.oneOrTwoFailuresCount}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </>
  );
}
