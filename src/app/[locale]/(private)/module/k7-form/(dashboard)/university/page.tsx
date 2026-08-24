import { notFound } from 'next/navigation';

import { getK7FormFilters, getK7FormRequests } from '@/actions/k7-form.actions';

import { K7DashboardPage } from '../../components/k7-dashboard-page';
import { K7_DASHBOARD_VIEW } from '../../constants';

export default async function K7UniversityReportsPage() {
  const filters = await getK7FormFilters();
  if (filters.departments.length === 0) {
    notFound();
  }

  const reports = await getK7FormRequests({ all: true });
  const departmentProfiles = filters.lecturers.flatMap(({ profiles, ...lecturer }) =>
    profiles.map((profile) => ({ ...lecturer, ...profile })),
  );
  const departmentNames = Object.fromEntries([
    ...filters.profiles.map((profile) => [profile.departmentId, profile.departmentName] as const),
    ...filters.departments.map(({ id, name }) => [id, name] as const),
  ]);

  return (
    <K7DashboardPage
      activeView={K7_DASHBOARD_VIEW.University}
      filters={filters}
      initialReports={reports}
      departmentNames={departmentNames}
      hasDepartmentProfiles={departmentProfiles.length > 0}
      all
    />
  );
}
