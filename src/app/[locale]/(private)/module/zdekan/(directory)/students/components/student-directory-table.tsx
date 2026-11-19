import { getTranslations } from 'next-intl/server';

import { Heading2 } from '@/components/typography';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { type StudentDirectoryEntry } from '@/types/models/dean-office';

export async function StudentDirectoryTable({
  students,
  department,
}: {
  students: StudentDirectoryEntry[];
  department?: string;
}) {
  const t = await getTranslations('private.dean-office');
  return (
    <div className="pt-4">
      <Heading2 className="mb-4 text-xl leading-7 lg:text-xl lg:leading-7">{department ?? t('students')}</Heading2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('group')}</TableHead>
            <TableHead>{t('course')}</TableHead>
            <TableHead>{t('educationLevel')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={students.length > 0} fallback={<TableEmptyRow colSpan={4}>{t('empty')}</TableEmptyRow>}>
            {students.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {
                    <Link className="underline" href={'/module/zdekan/students/' + row.id}>
                      {row.fullName}
                    </Link>
                  }
                </TableCell>
                <TableCell>{row.groupName ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.course ?? EMPTY_VALUE}</TableCell>
                <TableCell>{row.educationLevel ?? EMPTY_VALUE}</TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </div>
  );
}
