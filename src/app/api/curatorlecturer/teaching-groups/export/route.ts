import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import { CuratorGroup } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';

export async function GET() {
  const response = await campusFetch<CuratorGroup[]>('/curator-lecturer/teaching-groups');

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const groups: CuratorGroup[] = await response.json();
  const t = await getTranslations('private.curatorlecturer');
  const rows = [
    [t('table.group'), t('table.course'), t('table.curator'), t('table.description'), t('table.department')],
    ...groups.map((group) => [
      group.name,
      group.course,
      group.curatorName ?? t('table.not-assigned'),
      group.description,
      group.departmentName,
    ]),
  ];

  return createCsvResponse(rows, `study-groups-${dayjs().format('YYYY-MM-DD')}.csv`);
}
