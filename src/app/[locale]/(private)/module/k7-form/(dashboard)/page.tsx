import { objectify } from 'radash';

import { getK7FormFilters, getK7FormRequests } from '@/actions/k7-form.actions';

import { K7DashboardPage } from '../components/k7-dashboard-page';
import { K7_DASHBOARD_VIEW } from '../constants';

export default async function K7PersonalReportsPage() {
  const [filters, reports] = await Promise.all([getK7FormFilters(), getK7FormRequests({})]);
  const departmentProfiles = filters.lecturers.flatMap(({ profiles, ...lecturer }) =>
    profiles.map((profile) => ({ ...lecturer, ...profile })),
  );
  const departmentNames = objectify(
    filters.profiles,
    ({ departmentId }) => departmentId,
    ({ departmentName }) => departmentName,
  );

  return (
    <K7DashboardPage
      activeView={K7_DASHBOARD_VIEW.Personal}
      filters={filters}
      initialReports={reports}
      departmentNames={departmentNames}
      hasDepartmentProfiles={departmentProfiles.length > 0}
      all={false}
    />
  );
}
