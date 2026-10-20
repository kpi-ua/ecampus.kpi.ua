import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import queryString from 'query-string';

import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { filterAdministrationGroups } from '@/app/[locale]/(private)/module/curatorlecturer/utils/filter-administration-groups';
import { formatGroupDescription } from '@/app/[locale]/(private)/module/curatorlecturer/utils/format-group-description';
import { campusFetch } from '@/lib/client';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { createCsvResponse } from '@/lib/csv-response';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const yearId = Number(params.get('yearId'));
  const departmentId = params.get('departmentId');

  const query = queryString.stringify({ yearId, departmentId }, { skipNull: true });
  const response = await campusFetch<CuratorGroup[]>(`/curator-lecturer/admin/groups?${query}`);

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const groups = await response.json();
  const search = params.get('search')?.trim().toLocaleLowerCase();
  const t = await getTranslations('private.curatorlecturer.group-curator.administration');
  const rows = [
    [t('table.group'), t('table.course'), t('table.curator'), t('table.description'), t('table.department')],
    ...filterAdministrationGroups(groups, {
      search: search ?? '',
      course: params.get('course') || undefined,
      educationLevel: params.get('educationLevel') || undefined,
      studyForm: params.get('studyForm') || undefined,
    }).map((group) => [
      group.name,
      group.course,
      group.curatorName ?? t('not-assigned'),
      formatGroupDescription(group) || EMPTY_VALUE,
      group.departmentAbbreviation || group.departmentName,
    ]),
  ];

  return createCsvResponse(rows, `curator-administration-${yearId}-${dayjs().format('YYYY-MM-DD')}.csv`);
}
