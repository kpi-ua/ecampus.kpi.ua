import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import queryString from 'query-string';

import { CuratorDisciplineAttestationSemester } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { ATTESTATION_COLUMNS } from '@/app/[locale]/(private)/module/curatorlecturer/constants';
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

  const query = queryString.stringify({ yearId, semester, attestationId }, { skipNull: true });
  const response = await campusFetch<CuratorDisciplineAttestationSemester[]>(
    `/curator-lecturer/groups/${id}/attestations/disciplines?${query}`,
  );

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const data = await response.json();
  const t = await getTranslations('private.curatorlecturer.group-curator.results');
  const semesterT = await getTranslations('private.curatorlecturer.filters');
  const showRepeated = attestationId === null;
  const rows = [
    [
      semesterT('half-year'),
      t('discipline'),
      ...(showRepeated ? [t('not-attested-twice')] : []),
      ...ATTESTATION_COLUMNS.map((column) => t(column.label)),
    ],
    ...data.flatMap((term) => {
      const semesterName = semesterT(term.semester === 1 ? 'first-semester' : 'second-semester');
      return term.disciplines.map((discipline) => [
        semesterName,
        `${discipline.lecturerName} — ${discipline.name}`,
        ...(showRepeated ? [discipline.notAttestedTwiceCount] : []),
        ...ATTESTATION_COLUMNS.map((column) => discipline[column.key]),
      ]);
    }),
  ];

  return createCsvResponse(rows, `attestations-disciplines-${id}-${yearId}-${dayjs().format('YYYY-MM-DD')}.csv`);
}
