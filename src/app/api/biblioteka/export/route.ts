import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import { type NextRequest } from 'next/server';
import qs from 'query-string';

import { filterEmployees } from '@/app/[locale]/(private)/module/biblioteka/utils/filter-employees';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';
import { BibliotekaEmployee } from '@/types/models/biblioteka';

const LETTERS = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const departmentIdParam = params.get('departmentId');
  const departmentId = departmentIdParam === null ? undefined : Number(departmentIdParam);
  const letter = params.get('letter')?.trim().toUpperCase();

  if (
    (departmentId !== undefined && (!Number.isInteger(departmentId) || departmentId < 1)) ||
    (departmentId === undefined && (!letter || letter.length !== 1 || !LETTERS.includes(letter)))
  ) {
    return new Response(null, { status: 400 });
  }

  const url = qs.stringifyUrl({
    url: '/biblioteka/employees',
    query: { departmentId, letter: departmentId === undefined ? letter : undefined },
  });
  const response = await campusFetch<BibliotekaEmployee[]>(url);

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const employees = filterEmployees(await response.json(), {
    name: params.get('name') ?? '',
    orcid: params.get('orcid') ?? '',
    scopus: params.get('scopus') ?? '',
    researcher: params.get('researcher') ?? '',
    scholar: params.get('scholar') ?? '',
  });
  const locale = params.get('locale') === 'en' ? 'en' : 'uk';
  const t = await getTranslations({ locale, namespace: 'private.biblioteka' });
  const rows = [
    [t('table.name'), 'ORCID', 'Scopus ID', 'Researcher ID', 'Google Scholar'],
    ...employees.map((employee) => [
      `${employee.surname} ${employee.name} ${employee.patronymic}`,
      employee.orcid,
      employee.scopusId,
      employee.researcherId,
      employee.googleScholarId,
    ]),
  ];
  const label = (params.get('label') ?? String(departmentId ?? letter)).replace(/[^\p{L}\p{N}_-]/gu, '_').slice(0, 80);

  return createCsvResponse(rows, `biblioteka-${label}-${dayjs().format('YYYY-MM-DD')}.csv`);
}
