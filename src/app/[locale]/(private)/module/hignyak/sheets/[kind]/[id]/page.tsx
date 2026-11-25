import { getTranslations } from 'next-intl/server';

import { getDnvrSheet } from '@/actions/dnvr-sheets.actions';
import { Heading2 } from '@/components/typography';
import { Link } from '@/i18n/routing';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { ReportTable } from '../../../components/report-table';
import { getDnvrSheetsPath, getSheetKind, getSheetRouteId } from '../../sheet-routes';
import { formatSheetDate } from '../components/sheet-date';
import { getSheetStatus } from '../components/sheet-filter-options';

export default async function Page({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const input = await params;
  const kind = getSheetKind(input.kind);
  const id = getSheetRouteId(input.id);
  const [t, { sheet, students }] = await Promise.all([
    getTranslations('private.dnvr-reporting'),
    getDnvrSheet(kind, id),
  ]);
  const path = getDnvrSheetsPath(kind);
  const fields = [
    [t('faculty'), sheet.faculty],
    [t('group'), sheet.groupName],
    [t('assessments'), sheet.assessment],
    [t('discipline'), sheet.discipline],
    [t('lecturer'), sheet.lecturer],
    [t('createdBy'), sheet.createdBy],
    [t('opensAt'), formatSheetDate(sheet.startsAt)],
    [t('examAt'), formatSheetDate(sheet.examAt)],
    [t('locksAt'), formatSheetDate(sheet.locksAt)],
    [t('status'), t(getSheetStatus(sheet))],
  ];

  return (
    <>
      <Heading2>{t('sheetNumber', { id })}</Heading2>
      <div className="flex flex-wrap gap-4">
        <Link className="underline" href={`${path}/faculties/${sheet.facultyId}`}>
          {sheet.faculty}
        </Link>
        <Link className="underline" href={`${path}/${id}/schedule`}>
          {t('extendSheet')}
        </Link>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {fields.map(([label, value]) => (
          <div className="contents" key={label}>
            <dt className="font-medium">{label}</dt>
            <dd>{value ?? EMPTY_VALUE}</dd>
          </div>
        ))}
      </dl>
      <ReportTable
        headers={[t('student'), t('status'), t('marks'), t('nationalScale'), t('ects')]}
        rows={students.map((student) => ({
          id: student.id,
          cells: [student.name, student.status, student.mark, student.nationalScale, student.ects],
        }))}
      />
    </>
  );
}
