'use client';

import { useTranslations } from 'next-intl';

import { LecturerItemCell } from '@/app/[locale]/(private)/module/studysheet/[id]/components/lecturer-item-cell';
import { Paragraph } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { useTableSort } from '@/hooks/use-table-sort';
import { Link } from '@/i18n/routing';
import { round } from '@/lib/utils';
import { Discipline } from '@/types/models/current-control/sheet';

const MAX_SCORE = 100;

interface Props {
  disciplines: Discipline[];
}

export function DisciplinesTable({ disciplines }: Props) {
  const tTable = useTranslations('private.study-sheet.table');

  const { sortedRows, sortHandlers } = useTableSort<Discipline>(disciplines, (row, header) => row[header], ['score']);
  const hasGrades = disciplines.some((discipline) => discipline.score != null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{tTable('subject')}</TableHead>
          <TableHead sortHandlers={sortHandlers} sortHeader="score" className="cursor-pointer text-center">
            {tTable('score')}
          </TableHead>
          <TableHead>{tTable('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!hasGrades ? (
          <TableRow className="hover:bg-white">
            <TableCell colSpan={3} className="h-[212px] text-center text-neutral-500">
              <Paragraph className="m-0 text-lg font-semibold">{tTable('empty.title')}</Paragraph>
              <Paragraph className="m-0 mt-2 text-base">{tTable('empty.description')}</Paragraph>
            </TableCell>
          </TableRow>
        ) : (
          sortedRows.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="max-w-[336px] min-w-[200px]">
                <Link className="text-sm font-medium text-basic-black underline" href={`/module/studysheet/${d.id}`}>
                  {d.name}
                </Link>
              </TableCell>
              <TableCell className="max-w-[158px]">
                <Badge className="font-semibold text-basic-blue">
                  {round(Number(d.score), 2)}/{MAX_SCORE}
                </Badge>
              </TableCell>
              <TableCell className="flex max-w-[360px] flex-col gap-1">
                {d?.lecturers?.map((lecturer, index) => (
                  <LecturerItemCell key={index} photo={lecturer.photo} fullName={lecturer.fullName} />
                ))}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
