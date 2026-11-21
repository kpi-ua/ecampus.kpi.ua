'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { cn, formatDate } from '@/lib/utils';
import { type SessionSheet } from '@/types/models/session-administration';

import { CourseFilter } from './course-filter';

const columns = [
  'number',
  'course',
  'opensAt',
  'examAt',
  'closesAt',
  'group',
  'sheet',
  'retake',
  'assessment',
  'discipline',
  'lecturer',
] as const;
const columnWidths = {
  number: 'w-[9%]',
  course: 'w-[5%]',
  opensAt: 'w-[9%]',
  examAt: 'w-[9%]',
  closesAt: 'w-[9%]',
  group: 'w-[7%]',
  sheet: 'w-[7%]',
  retake: 'w-[9%]',
  assessment: 'w-[10%]',
  discipline: 'w-[14%]',
  lecturer: 'w-[12%]',
} as const;
const statuses = ['open', 'closed', 'upcoming', 'unscheduled'] as const;
const statusStyles = { open: 'bg-green-50', closed: '', upcoming: 'bg-blue-50', unscheduled: '' };

export function SessionSheetsTable({
  sheets,
  course,
  lecturerView,
}: {
  sheets: SessionSheet[];
  course: number;
  lecturerView: boolean;
}) {
  const t = useTranslations('private.session-administration');
  const [hiddenStatuses, setHiddenStatuses] = useState<SessionSheet['status'][]>([]);
  const [retake, setRetake] = useState('all');
  const [form, setForm] = useState('all');
  const filterOptions = [
    ...new Map(
      sheets
        .filter((sheet) => sheet.educationFormId && sheet.educationForm)
        .map((sheet) => [sheet.educationFormId, sheet.educationForm]),
    ).entries(),
  ];
  const rows = sheets
    .map((sheet) => ({
      sheet,
      values: {
        number: sheet.number,
        course: String(sheet.course),
        opensAt: sheet.opensAt ? formatDate(sheet.opensAt, 'DD.MM.YYYY') : '—',
        examAt: sheet.examAt ? formatDate(sheet.examAt, 'DD.MM.YYYY') : '—',
        closesAt: sheet.closesAt ? formatDate(sheet.closesAt, 'DD.MM.YYYY') : '—',
        group: sheet.group,
        sheet: t('view'),
        retake: t(sheet.retake === 0 ? 'main' : 'retakeOption', { number: sheet.retake }),
        assessment: sheet.assessment,
        discipline: sheet.discipline,
        lecturer: sheet.lecturer ?? '—',
      },
    }))
    .filter(
      ({ sheet }) =>
        !hiddenStatuses.includes(sheet.status) &&
        (retake === 'all' || (retake === 'additional' ? sheet.retake > 0 : String(sheet.retake) === retake)) &&
        (form === 'all' || sheet.educationFormId === form),
    );

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className={cn('grid gap-4', lecturerView ? 'sm:grid-cols-2' : 'md:grid-cols-3')}>
        {!lecturerView && <CourseFilter />}
        <Select value={retake} onValueChange={setRetake}>
          <SelectTrigger className="w-full" aria-label={t('retake')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allSheetTypes')}</SelectItem>
            <SelectItem value="0">{t('main')}</SelectItem>
            <SelectItem value="additional">{t('additionalSheets')}</SelectItem>
            <SelectItem value="1">{t('retakeOption', { number: 1 })}</SelectItem>
            <SelectItem value="2">{t('retakeOption', { number: 2 })}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={form} onValueChange={setForm}>
          <SelectTrigger className="w-full" aria-label={t('educationForm')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allForms')}</SelectItem>
            {filterOptions.map(([value, name]) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <fieldset className="flex min-w-0 flex-wrap gap-x-5 gap-y-3">
        <legend className="mb-2 text-sm font-medium">{t('status')}</legend>
        {statuses.map((value) => (
          <label key={value} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={!hiddenStatuses.includes(value)}
              onCheckedChange={(checked) => {
                setHiddenStatuses((previous) =>
                  checked === true ? previous.filter((item) => item !== value) : [...previous, value],
                );
              }}
            />
            {t(value)}
          </label>
        ))}
      </fieldset>
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-sm text-muted-foreground">{t('count', { visible: rows.length, total: sheets.length })}</p>
        <Table className="min-w-[72rem] table-fixed">
          <colgroup>
            {columns.map((column) => (
              <col key={column} className={columnWidths[column]} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{t(column)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {rows.map(({ sheet, values }) => (
              <TableRow key={sheet.id + ':' + sheet.retake} className={statusStyles[sheet.status]}>
                {columns.map((column) => (
                  <TableCell key={column} className="wrap-anywhere">
                    {column === 'sheet' ? (
                      <Link
                        className="underline"
                        href={{
                          pathname: '/module/vedomostadmin/sheets/' + encodeURIComponent(sheet.id) + '/' + sheet.retake,
                          query: { course: lecturerView ? 0 : course },
                        }}
                      >
                        {values.sheet}
                      </Link>
                    ) : column === 'lecturer' && !lecturerView && sheet.employeeId && sheet.employeeId !== '0' ? (
                      <Link
                        className="underline"
                        href={{ pathname: '/module/vedomostadmin', query: { employeeId: sheet.employeeId } }}
                      >
                        {values.lecturer}
                      </Link>
                    ) : (
                      (values[column] ?? '—')
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
