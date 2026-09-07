import { notFound } from 'next/navigation';

import { getK7FormFilters } from '@/actions/k7-form.actions';

import { K7DashboardPage } from '../../components/k7-dashboard-page';
import { K7_DASHBOARD_VIEW } from '../../constants';

export default async function K7UniversityReportsPage() {
  const filters = await getK7FormFilters();
  if (filters.cathedras.length === 0) {
    notFound();
  }

  const departmentProfiles = filters.lecturers.flatMap(({ profiles, ...lecturer }) =>
    profiles.map((profile) => ({ ...lecturer, ...profile })),
  );
  const departmentNames = Object.fromEntries([
    ...filters.profiles.map((profile) => [profile.departmentId, profile.departmentName] as const),
    ...filters.cathedras.map(({ id, name }) => [id, name] as const),
  ]);

  return (
    <K7DashboardPage
      activeView={K7_DASHBOARD_VIEW.University}
      filters={filters}
      initialReports={[]}
      departmentNames={departmentNames}
      hasDepartmentProfiles={departmentProfiles.length > 0}
      all
    />
  );
}
