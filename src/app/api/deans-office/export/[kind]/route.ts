import { getTranslations } from 'next-intl/server';
import { type NextRequest } from 'next/server';
import qs from 'query-string';

import { loadDeansOfficeSearchParams } from '@/app/[locale]/(private)/module/deans-office/search-params';
import { DEFAULT_LOCALE, LOCALE } from '@/i18n/routing';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';
import { formatDate } from '@/lib/utils';
import { type DeansOfficeGroupCount, type DeansOfficeOption, type DeansOfficeReportRow } from '@/types/models/deans-office';

export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const query = request.nextUrl.searchParams;
  const { facultyId, groupId, yearId, semester, periodTypeId } = loadDeansOfficeSearchParams(query);
  const locale = query.get('locale') === LOCALE.EN ? LOCALE.EN : DEFAULT_LOCALE;
  const t = await getTranslations({ locale, namespace: 'private.deans-office' });
  const filename = `deans-office-${kind}-${formatDate(new Date())}.csv`;

  if (kind === 'roster' && groupId) {
    const url = qs.stringifyUrl(
      { url: `/deans-office/groups/${groupId}/students`, query: { facultyId } },
      { skipNull: true },
    );
    const response = await campusFetch<DeansOfficeOption[]>(url);
    if (!response.ok) {
      return new Response(null, { status: response.status });
    }
    const students = await response.json();
    return createCsvResponse([[t('student')], ...students.map((student) => [student.name])], filename);
  }

  if (kind === 'groups' && yearId) {
    const url = qs.stringifyUrl({ url: '/deans-office/group-counts', query: { facultyId, yearId } }, { skipNull: true });
    const response = await campusFetch<DeansOfficeGroupCount[]>(url);
    if (!response.ok) {
      return new Response(null, { status: response.status });
    }
    const groups = await response.json();
    return createCsvResponse(
      [
        [t('department'), t('course'), t('group'), t('studentCount')],
        ...groups.map((group) => [group.department, group.course, group.groupName, group.studentCount]),
      ],
      filename,
    );
  }

  if (kind === 'reports' && yearId && (semester === 1 || semester === 2) && periodTypeId) {
    const url = qs.stringifyUrl(
      { url: '/deans-office/reports', query: { facultyId, yearId, semester, periodTypeId } },
      { skipNull: true },
    );
    const response = await campusFetch<DeansOfficeReportRow[]>(url);
    if (!response.ok) {
      return new Response(null, { status: response.status });
    }
    const report = await response.json();
    return createCsvResponse(
      [
        [
          t('course'),
          t('educationLevel'),
          t('groupCount'),
          t('studentCount'),
          t('attested'),
          t('notAttested'),
          t('threeOrMoreFailures'),
          t('oneOrTwoFailures'),
        ],
        ...report.map((row) => [
          row.course,
          row.educationLevel,
          row.groupCount,
          row.studentCount,
          row.attestedCount,
          row.notAttestedCount,
          row.threeOrMoreFailuresCount,
          row.oneOrTwoFailuresCount,
        ]),
      ],
      filename,
    );
  }

  return new Response(null, { status: 400 });
}
