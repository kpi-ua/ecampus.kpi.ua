import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDekanatOptions } from '@/actions/dekanat.actions';

import { DekanatSelect } from './components/dekanat-select';
import { loadDekanatSearchParams } from './search-params';
import { INTL_NAMESPACE } from './translations';

export async function loadDekanatFilters(searchParams: Promise<SearchParams>) {
  const params = await loadDekanatSearchParams(searchParams);
  const [options, t] = await Promise.all([getDekanatOptions(params.facultyId), getTranslations(INTL_NAMESPACE)]);
  const faculty = options.faculties.find((item) => item.id === params.facultyId) ?? options.faculties[0];
  const departmentId = options.departments.find((item) => item.id === params.departmentId)?.id ?? null;
  const yearId = options.years.find((item) => item.id === params.yearId)?.id ?? options.years[0]?.id ?? null;
  const semester = params.semester === 2 ? 2 : 1;
  const periodTypeId =
    options.periodTypes.find((item) => item.id === params.periodTypeId)?.id ?? options.periodTypes[0]?.id ?? null;

  return {
    params,
    options,
    t,
    faculty,
    facultyFilter: faculty && (
      <DekanatSelect name="facultyId" value={faculty.id} label={t('faculty')} options={options.faculties} />
    ),
    departmentId,
    yearId,
    semester,
    periodTypeId,
  };
}
