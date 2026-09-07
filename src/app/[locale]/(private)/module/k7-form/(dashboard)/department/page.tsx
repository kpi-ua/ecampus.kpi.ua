import { notFound } from 'next/navigation';

import { getK7FormFilters, getK7FormRequests } from '@/actions/k7-form.actions';

import { K7DashboardPage } from '../../components/k7-dashboard-page';
import { K7_DASHBOARD_VIEW } from '../../constants';

export default async function K7DepartmentReportsPage() {
  const filters = await getK7FormFilters();
  const departmentProfiles = filters.lecturers.flatMap(({ profiles, ...lecturer }) =>
    profiles.map((profile) => ({ ...lecturer, ...profile })),
  );

  if (departmentProfiles.length === 0) {
    notFound();
  }

  const administeredReports = await getK7FormRequests({ all: true });
  const departmentNames = Object.fromEntries(
    [...filters.profiles, ...departmentProfiles].map((profile) => [profile.departmentId, profile.departmentName]),
  );

  return (
    <K7DashboardPage
      activeView={K7_DASHBOARD_VIEW.Department}
      filters={filters}
      initialReports={administeredReports}
      departmentProfiles={departmentProfiles}
      departmentNames={departmentNames}
      hasDepartmentProfiles
      all
    />
  );
}
