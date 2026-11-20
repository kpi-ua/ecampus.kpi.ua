import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeansOfficeOptions } from '@/actions/deans-office.actions';

import { loadDeansOfficeSearchParams } from './search-params';
import { INTL_NAMESPACE } from './translations';

export async function loadDeansOfficeFilters(searchParams: Promise<SearchParams>) {
  const params = await loadDeansOfficeSearchParams(searchParams);
  const [options, t] = await Promise.all([getDeansOfficeOptions(null), getTranslations(INTL_NAMESPACE)]);
  const departmentId = options.departments.find((item) => item.id === params.departmentId)?.id ?? null;
  const semester = params.semester === 2 ? 2 : 1;
  const periodTypeId =
    options.periodTypes.find((item) => item.id === params.periodTypeId)?.id ?? options.periodTypes[0]?.id ?? null;

  return {
    params,
    options,
    t,
    departmentId,
    semester,
    periodTypeId,
  };
}
