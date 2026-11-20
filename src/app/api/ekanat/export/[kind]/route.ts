import { getTranslations } from 'next-intl/server';
import { type NextRequest } from 'next/server';
import qs from 'query-string';

import { loadDekanatSearchParams } from '@/app/[locale]/(private)/module/ekanat/search-params';
import { DEFAULT_LOCALE, LOCALE } from '@/i18n/routing';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';
import { formatDate } from '@/lib/utils';
import { type DekanatGroupCount, type DekanatOption, type DekanatReportRow } from '@/types/models/dekanat';

export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const query = request.nextUrl.searchParams;
  const { facultyId, groupId, yearId, semester, periodTypeId } = loadDekanatSearchParams(query);
  const locale = query.get('locale') === LOCALE.EN ? LOCALE.EN : DEFAULT_LOCALE;
  const t = await getTranslations({ locale, namespace: 'private.ekanat' });
  const filename = `ekanat-${kind}-${formatDate(new Date())}.csv`;

  if (kind === 'roster' && groupId) {
    const url = qs.stringifyUrl(
      { url: `/ekanat/groups/${groupId}/students`, query: { facultyId } },
      { skipNull: true },
    );
    const response = await campusFetch<DekanatOption[]>(url);
    if (!response.ok) {
      return new Response(null, { status: response.status });
    }
    const students = await response.json();
    return createCsvResponse([[t('student')], ...students.map((student) => [student.name])], filename);
  }

  if (kind === 'groups' && yearId) {
    const url = qs.stringifyUrl({ url: '/ekanat/group-counts', query: { facultyId, yearId } }, { skipNull: true });
    const response = await campusFetch<DekanatGroupCount[]>(url);
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
      { url: '/ekanat/reports', query: { facultyId, yearId, semester, periodTypeId } },
      { skipNull: true },
    );
    const response = await campusFetch<DekanatReportRow[]>(url);
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
