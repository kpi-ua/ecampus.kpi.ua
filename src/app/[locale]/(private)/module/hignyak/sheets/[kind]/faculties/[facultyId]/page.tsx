import { getTranslations } from 'next-intl/server';
import { createLoader, type SearchParams } from 'nuqs/server';

import { getDnvrFacultySheets } from '@/actions/dnvr-sheets.actions';
import { Heading2 } from '@/components/typography';
import { Link } from '@/i18n/routing';

import { ReportTable } from '../../../../components/report-table';
import { getDnvrSheetsPath, getSheetKind, getSheetRouteId } from '../../../sheet-routes';
import { formatSheetDate } from '../../components/sheet-date';
import { getSheetStatus, matchesSheetType, sheetFilters } from '../../components/sheet-filter-options';
import { SheetFilters } from '../../components/sheet-filters';

const load = createLoader(sheetFilters);

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string; facultyId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const input = await params;
  const kind = getSheetKind(input.kind);
  const facultyId = getSheetRouteId(input.facultyId);
  const [{ course, status, sheetType }, t, sheets] = await Promise.all([
    load(searchParams),
    getTranslations('private.dnvr-reporting'),
    getDnvrFacultySheets(kind, facultyId),
  ]);
  const path = getDnvrSheetsPath(kind);
  const courses = [...new Set(sheets.map((row) => row.course))].sort((left, right) => left - right);

  const selectedCourse = course !== null && courses.includes(course) ? course : null;
  const rows = sheets.filter(
    (row) =>
      (selectedCourse === null || row.course === selectedCourse) &&
      (status === null || getSheetStatus(row) === status) &&
      (sheetType === null || matchesSheetType(row, sheetType)),
  );

  return (
    <>
      <Heading2>{sheets[0]?.faculty ?? t('sheets')}</Heading2>
      <Link className="self-start underline" href={path}>
        {t('faculties')}
      </Link>
      <SheetFilters courses={courses} />
      <ReportTable
        headers={[
          t('sheet'),
          t('course'),
          t('group'),
          t('assessments'),
          t('discipline'),
          t('lecturer'),
          t('opensAt'),
          t('examAt'),
          t('locksAt'),
          t('status'),
          t('marks'),
          t('sentToDean'),
          t('extendSheet'),
        ]}
        rows={rows.map((row) => ({
          id: row.id,
          cells: [
            <Link key="sheet" className="underline" href={`${path}/${row.id}`}>
              {row.id}
            </Link>,
            row.course,
            row.groupName,
            row.assessment,
            row.discipline,
            row.lecturer,
            formatSheetDate(row.startsAt),
            formatSheetDate(row.examAt),
            formatSheetDate(row.locksAt),
            t(getSheetStatus(row)),
            row.markCount,
            t(row.isSentToDean ? 'yes' : 'no'),
            <Link key="schedule" className="underline" href={`${path}/${row.id}/schedule`}>
              {t('extendSheet')}
            </Link>,
          ],
        }))}
      />
    </>
  );
}
