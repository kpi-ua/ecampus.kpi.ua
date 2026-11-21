'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { formatDate } from '@/lib/utils';
import { type SessionSheet } from '@/types/models/session-administration';

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
const statuses = ['open', 'closed', 'upcoming', 'unscheduled'] as const;
const statusStyles = { open: 'bg-green-50', closed: 'bg-red-50', upcoming: 'bg-blue-50', unscheduled: '' };

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
  const [filters, setFilters] = useState<Partial<Record<(typeof columns)[number], string>>>({});
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
      ({ sheet, values }) =>
        !hiddenStatuses.includes(sheet.status) &&
        (retake === 'all' || (retake === 'additional' ? sheet.retake > 0 : String(sheet.retake) === retake)) &&
        (form === 'all' || sheet.educationFormId === form) &&
        columns.every((column) =>
          (values[column] ?? '').toLocaleLowerCase().includes((filters[column] ?? '').trim().toLocaleLowerCase()),
        ),
    );

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <fieldset className="flex flex-wrap gap-3">
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
        <Select value={retake} onValueChange={setRetake}>
          <SelectTrigger className="w-full sm:max-w-xs" aria-label={t('retake')}>
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
          <SelectTrigger className="w-full sm:max-w-xs" aria-label={t('educationForm')}>
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
      <p className="text-sm">{t('count', { visible: rows.length, total: sheets.length })}</p>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{t(column)}</TableHead>
            ))}
          </TableRow>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>
                {column !== 'sheet' && (
                  <Input
                    className="min-w-20"
                    aria-label={t(column)}
                    value={filters[column] ?? ''}
                    onChange={(event) => setFilters({ ...filters, [column]: event.target.value })}
                  />
                )}
              </TableCell>
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
                <TableCell key={column}>
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
    </>
  );
}
