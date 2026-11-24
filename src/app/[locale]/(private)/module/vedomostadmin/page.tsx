import { type SearchParams } from 'nuqs/server';

import { getSessionAdministrationSheets } from '@/actions/session-administration.actions';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';

import { SessionSheetsTable } from './components/session-sheets-table';
import { loadSessionAdministrationSearchParams } from './search-params';

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { course, employeeId } = await loadSessionAdministrationSearchParams(searchParams);
  const sheets = await getSessionAdministrationSheets(employeeId ? 0 : course, employeeId ?? undefined);
  return (
    <Card className="flex min-w-0 flex-col gap-5 p-4 sm:p-6">
      {employeeId && sheets[0]?.lecturer && (
        <Heading2 className="text-xl leading-tight lg:text-xl lg:leading-tight">{sheets[0].lecturer}</Heading2>
      )}
      <SessionSheetsTable sheets={sheets} course={course} lecturerView={employeeId !== null} />
    </Card>
  );
}
