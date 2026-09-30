import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import { type NextRequest } from 'next/server';
import qs from 'query-string';

import {
  CuratorAttestationStudent,
  CuratorStudentCredentials,
  CuratorSurveyRow,
} from '@/app/[locale]/(private)/module/kurator/types';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';

type ExportType = 'overview' | 'attestation' | 'survey';

const exportTypes: ExportType[] = ['overview', 'attestation', 'survey'];

const buildQuery = (params: Record<string, number | undefined>) =>
  qs.stringify(params, { skipEmptyString: true, skipNull: true });

const filterByName = <T extends { fullName: string }>(rows: T[], search: string) => {
  const query = search.trim().toLocaleLowerCase();
  return query ? rows.filter((row) => row.fullName.toLocaleLowerCase().includes(query)) : rows;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId: groupIdParam } = await params;
  const groupId = Number(groupIdParam);
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') as ExportType | null;
  const search = searchParams.get('search') ?? '';

  if (!Number.isInteger(groupId) || groupId < 1 || !type || !exportTypes.includes(type)) {
    return new Response(null, { status: 400 });
  }

  const locale = searchParams.get('locale') === 'en' ? 'en' : 'uk';
  const t = await getTranslations({ locale, namespace: 'private.curator.lecturer.group-curator' });
  const filename = `curator-group-${groupId}-${type}-${dayjs().format('YYYY-MM-DD')}.csv`;

  if (type === 'overview') {
    const response = await campusFetch<CuratorStudentCredentials[]>(`/curator/groups/${groupId}/students/credentials`);
    if (!response.ok) return new Response(null, { status: response.status });

    const students = filterByName(await response.json(), search);
    const rows = [
      [
        t('students.name'),
        t('students.login'),
        t('students.password'),
        t('students.status'),
        t('students.contacts'),
        t('students.code-of-honor'),
      ],
      ...students.map((student) => [
        student.fullName,
        student.login ?? '—',
        student.passwordChanged ? '••••••••' : (student.initialPassword ?? '—'),
        student.passwordChanged ? t('students.password-changed') : t('students.initial-password'),
        [student.email, ...student.curatorContacts].filter(Boolean).join(', ') || '—',
        student.codeOfHonorSignDate
          ? t('students.agreed', { date: dayjs(student.codeOfHonorSignDate).format('DD.MM.YYYY') })
          : t('students.not-agreed'),
      ]),
    ];

    return createCsvResponse(rows, filename);
  }

  if (type === 'attestation') {
    const yearId = Number(searchParams.get('yearId'));
    const semesterParam = searchParams.get('semester');
    const semester = semesterParam ? Number(semesterParam) : undefined;
    const attestationId = Number(searchParams.get('attestationId'));
    if (
      !Number.isInteger(yearId) ||
      yearId < 1 ||
      (semester !== undefined && (!Number.isInteger(semester) || semester < 1)) ||
      !Number.isInteger(attestationId) ||
      attestationId < 1
    ) {
      return new Response(null, { status: 400 });
    }

    const url = `/curator/groups/${groupId}/attestations?${buildQuery({ yearId, semester, attestationId })}`;
    const response = await campusFetch<CuratorAttestationStudent[]>(url);
    if (!response.ok) return new Response(null, { status: response.status });

    const students = filterByName(await response.json(), search);
    return createCsvResponse(
      [
        [
          t('results.student'),
          t('results.attested'),
          t('results.missing'),
          t('results.not-attested'),
          t('results.not-studying'),
        ],
        ...students.map((student) => [
          student.fullName,
          student.attested,
          student.missing,
          student.notAttested,
          student.notStudying,
        ]),
      ],
      filename,
    );
  }

  const response = await campusFetch<CuratorSurveyRow[]>(`/curator/groups/${groupId}/surveys`);
  if (!response.ok) return new Response(null, { status: response.status });

  const rowsByStudent = filterByName(await response.json(), search).reduce<CuratorSurveyRow[][]>((groups, row) => {
    const group = groups.find((items) => items[0].studentId === row.studentId);
    if (group) group.push(row);
    else groups.push([row]);
    return groups;
  }, []);

  return createCsvResponse(
    [
      [t('results.student'), t('results.survey-count')],
      ...rowsByStudent.map((studentRows) => [
        studentRows[0].fullName,
        t('results.completed-count', {
          completed: studentRows.filter((row) => row.hasVoted).length,
          total: studentRows.length,
        }),
      ]),
    ],
    filename,
  );
}
