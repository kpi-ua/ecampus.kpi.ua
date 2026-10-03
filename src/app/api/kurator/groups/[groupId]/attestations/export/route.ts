import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import { CuratorAttestationStudent } from '@/app/[locale]/(private)/module/kurator/types';
import { ATTESTATION_COLUMNS } from '@/app/[locale]/(private)/module/kurator/constants';
import { getSemesterAttestations } from '@/app/[locale]/(private)/module/kurator/utils/get-semester-attestations';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';

interface Props {
  params: Promise<{ groupId: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { groupId } = await params;
  const id = Number(groupId);
  const searchParams = new URL(request.url).searchParams;
  const yearId = Number(searchParams.get('yearId'));
  const semester = searchParams.get('semester');
  const attestationId = searchParams.get('attestationId');
  const isValidId = (value: number) => Number.isInteger(value) && value > 0 && value <= 2147483647;

  if (
    !isValidId(id) ||
    !isValidId(yearId) ||
    (semester !== null && semester !== '1' && semester !== '2') ||
    (attestationId !== null && !isValidId(Number(attestationId)))
  ) {
    return new Response(null, { status: 400 });
  }

  const query = new URLSearchParams({ yearId: String(yearId) });
  if (semester !== null) query.set('semester', semester);
  if (attestationId !== null) query.set('attestationId', attestationId);
  const response = await campusFetch<CuratorAttestationStudent[]>(
    `/curator-lecturer/groups/${id}/attestations?${query}`,
  );

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const students: CuratorAttestationStudent[] = await response.json();
  const t = await getTranslations('private.curator.lecturer.group-curator.results');
  const semesterT = await getTranslations('private.curator.lecturer.filters');
  const showRepeated = attestationId === null;
  const semesters = semester === null ? [1, 2] : [Number(semester)];
  const rows = [
    [
      semesterT('half-year'),
      t('student'),
      ...(showRepeated ? [t('not-attested-twice')] : []),
      ...ATTESTATION_COLUMNS.map((column) => t(column.label)),
    ],
    ...semesters.flatMap((term) =>
      getSemesterAttestations(students, term).map((student) => [
        semesterT(term === 1 ? 'first-semester' : 'second-semester'),
        student.fullName,
        ...(showRepeated ? [student.notAttestedTwice] : []),
        student.attested,
        student.missing,
        student.notAttested,
        student.notStudying,
      ]),
    ),
  ];

  return createCsvResponse(rows, `attestations-${id}-${yearId}-${dayjs().format('YYYY-MM-DD')}.csv`);
}
