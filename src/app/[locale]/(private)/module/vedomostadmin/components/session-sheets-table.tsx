'use client';

import { useTranslations } from 'next-intl';
import { dash, select } from 'radash';
import { useState } from 'react';

import { Paragraph } from '@/components/typography';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { cn, formatDateOrPlaceholder } from '@/lib/utils';
import { type SessionSheet, SessionSheetStatus } from '@/types/models/session-administration';

import { CourseFilter } from './course-filter';

enum RetakeFilter {
  All = 'all',
  Main = '0',
  Additional = 'additional',
  First = '1',
  Second = '2',
}

const statuses = Object.values(SessionSheetStatus);
const statusStyles: Record<SessionSheetStatus, string> = {
  [SessionSheetStatus.Open]: 'bg-green-50',
  [SessionSheetStatus.Closed]: '',
  [SessionSheetStatus.Upcoming]: 'bg-blue-50',
  [SessionSheetStatus.Unscheduled]: '',
};

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
  const tStudyForm = useTranslations('global.enums.study-form');
  const [hiddenStatuses, setHiddenStatuses] = useState<SessionSheetStatus[]>([]);
  const [retake, setRetake] = useState(RetakeFilter.All);
  const [form, setForm] = useState('all');
  const studyModes = new Map(
    select(
      sheets,
      ({ educationFormId, educationForm }) => [educationFormId, educationForm] as const,
      ({ educationFormId, educationForm }) => Boolean(educationFormId && educationForm),
    ),
  );
  const rows = sheets.filter(
    (sheet) =>
      !hiddenStatuses.includes(sheet.status) &&
      (retake === RetakeFilter.All ||
        (retake === RetakeFilter.Additional ? sheet.retake > 0 : String(sheet.retake) === retake)) &&
      (form === 'all' || sheet.educationFormId === form),
  );

  const handleRetakeChange = (value: string) => {
    const selected = Object.values(RetakeFilter).find((option) => option === value);
    if (!!selected) {
      setRetake(selected);
    }
  };

  const handleFormChange = (value: string) => {
    setForm(value);
  };

  const handleStatusChange = (status: SessionSheetStatus) => (checked: boolean | 'indeterminate') => {
    setHiddenStatuses((previous) =>
      checked === true ? previous.filter((item) => item !== status) : [...previous, status],
    );
  };

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className={cn('grid gap-4', lecturerView ? 'sm:grid-cols-2' : 'md:grid-cols-3')}>
        {!lecturerView && <CourseFilter />}
        <Select value={retake} onValueChange={handleRetakeChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RetakeFilter.All}>{t('allSheetTypes')}</SelectItem>
            <SelectItem value={RetakeFilter.Main}>{t('main')}</SelectItem>
            <SelectItem value={RetakeFilter.Additional}>{t('additionalSheets')}</SelectItem>
            <SelectItem value={RetakeFilter.First}>{t('retakeOption', { number: 1 })}</SelectItem>
            <SelectItem value={RetakeFilter.Second}>{t('retakeOption', { number: 2 })}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={form} onValueChange={handleFormChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allForms')}</SelectItem>
            {Array.from(studyModes, ([value, studyForm]) => (
              <SelectItem key={value} value={value}>
                {tStudyForm(dash(studyForm))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <fieldset className="flex min-w-0 flex-wrap gap-x-5 gap-y-3">
        <legend className="mb-2 text-sm font-medium">{t('status')}</legend>
        {statuses.map((value) => (
          <label key={value} className="flex items-center gap-2 text-sm">
            <Checkbox checked={!hiddenStatuses.includes(value)} onCheckedChange={handleStatusChange(value)} />
            {t(value)}
          </label>
        ))}
      </fieldset>
      <div className="flex min-w-0 flex-col gap-3">
        <Paragraph className="my-0 text-sm leading-normal text-muted-foreground">
          {t('count', { visible: rows.length, total: sheets.length })}
        </Paragraph>
        <Table className="min-w-[72rem] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[9%]">{t('number')}</TableHead>
              <TableHead className="w-[5%]">{t('course')}</TableHead>
              <TableHead className="w-[9%]">{t('opensAt')}</TableHead>
              <TableHead className="w-[9%]">{t('examAt')}</TableHead>
              <TableHead className="w-[9%]">{t('closesAt')}</TableHead>
              <TableHead className="w-[7%]">{t('group')}</TableHead>
              <TableHead className="w-[7%]">{t('sheet')}</TableHead>
              <TableHead className="w-[9%]">{t('retake')}</TableHead>
              <TableHead className="w-[10%]">{t('assessment')}</TableHead>
              <TableHead className="w-[14%]">{t('discipline')}</TableHead>
              <TableHead className="w-[12%]">{t('lecturer')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={11}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {rows.map((sheet) => (
              <TableRow key={sheet.id + ':' + sheet.retake} className={statusStyles[sheet.status]}>
                <TableCell>{sheet.number ?? EMPTY_VALUE}</TableCell>
                <TableCell>{sheet.course}</TableCell>
                <TableCell>{formatDateOrPlaceholder(sheet.opensAt)}</TableCell>
                <TableCell>{formatDateOrPlaceholder(sheet.examAt)}</TableCell>
                <TableCell>{formatDateOrPlaceholder(sheet.closesAt)}</TableCell>
                <TableCell className="wrap-anywhere">{sheet.group ?? EMPTY_VALUE}</TableCell>
                <TableCell>
                  <Link
                    className="underline"
                    href={{
                      pathname: '/module/vedomostadmin/sheets/' + encodeURIComponent(sheet.id) + '/' + sheet.retake,
                      query: { course: lecturerView ? 0 : course },
                    }}
                  >
                    {t('view')}
                  </Link>
                </TableCell>
                <TableCell>{t(sheet.retake === 0 ? 'main' : 'retakeOption', { number: sheet.retake })}</TableCell>
                <TableCell className="wrap-anywhere">{sheet.assessment ?? EMPTY_VALUE}</TableCell>
                <TableCell className="wrap-anywhere">{sheet.discipline ?? EMPTY_VALUE}</TableCell>
                <TableCell className="wrap-anywhere">
                  {!lecturerView && sheet.employeeId && sheet.employeeId !== '0' ? (
                    <Link
                      className="underline"
                      href={{ pathname: '/module/vedomostadmin', query: { employeeId: sheet.employeeId } }}
                    >
                      {sheet.lecturer ?? EMPTY_VALUE}
                    </Link>
                  ) : (
                    (sheet.lecturer ?? EMPTY_VALUE)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
