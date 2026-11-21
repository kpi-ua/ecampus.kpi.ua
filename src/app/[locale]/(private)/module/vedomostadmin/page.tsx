import { type SearchParams } from 'nuqs/server';

import { getSessionAdministrationSheets } from '@/actions/session-administration.actions';
import { Card } from '@/components/ui/card';

import { CourseFilter } from './components/course-filter';
import { SessionSheetsTable } from './components/session-sheets-table';
import { loadSessionAdministrationSearchParams } from './search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { course, employeeId } = await loadSessionAdministrationSearchParams(searchParams);
  const sheets = await getSessionAdministrationSheets(employeeId ? 0 : course, employeeId ?? undefined);
  return (
    <Card className="min-w-0 space-y-4 p-6">
      {employeeId ? <h2 className="text-xl font-semibold">{sheets[0]?.lecturer}</h2> : <CourseFilter />}
      <SessionSheetsTable sheets={sheets} course={course} lecturerView={employeeId !== null} />
    </Card>
  );
}
