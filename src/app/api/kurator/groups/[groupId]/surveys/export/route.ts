import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { CuratorSurveyRow } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ groupId: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { groupId } = await params;
  const id = parseInt(groupId);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const response = await campusFetch<CuratorSurveyRow[]>(`/curator-lecturer/groups/${id}/surveys`);

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const surveys = await response.json();
  const t = await getTranslations('private.curatorlecturer.group-curator');
  const rows = [
    [t('results.student'), t('results.lecturer'), t('survey.discipline'), t('results.status')],
    ...surveys.map((row) => [
      row.fullName,
      row.lecturerName,
      row.discipline.name,
      row.hasVoted ? t('results.completed') : t('results.not-completed'),
    ]),
  ];

  return createCsvResponse(rows, `surveys-${id}-${formatDate(new Date())}.csv`);
}
