import { getTranslations } from 'next-intl/server';
import { createLoader, parseAsInteger, type SearchParams } from 'nuqs/server';
import qs from 'query-string';
import { type ReactNode } from 'react';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { campusFetch } from '@/lib/client';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';

import { DnvrNavigation } from '../../components/dnvr-navigation';
import { DnvrTabs } from '../../components/dnvr-tabs';
import { ReportTable } from '../../components/report-table';
import { type CurrentControlView as View, currentControlViews, getCurrentControlPath } from '../../routes';
import { DepartmentFilter } from './department-filter';

interface Item {
  id: number;
  name: string;
}
interface Department extends Item {
  faculty: string;
}
interface Group {
  group: Item;
  course: number;
  disciplineCount: number;
  sheetCount: number;
}
interface Discipline {
  group: Item;
  discipline: Item;
  sheetCount: number;
  teachingDepartment?: string;
  teachingTypes?: string;
}
interface Employee {
  employeeId: number;
  fullName: string;
  department: string;
  status?: string;
  contractEnd?: string;
  sheetCount: number;
}
interface Activity {
  date: string;
}
interface Sheet {
  sheetId: number;
  employeeSheetId: number;
  employee: Item;
  group: Item;
  discipline: Item;
  name: string;
  assessmentCount: number;
  markCount: number;
  course: number;
}
interface Mark {
  student: Item;
  assessment: Item | null;
  assessmentDate: string | null;
  sheetName: string;
  lecturer: string;
  mark: number | null;
}
interface Statistic {
  group: Item;
  discipline: Item;
  teachingDepartment: Item;
  recipientDepartment: string;
  lecturers: string;
  markCount: number;
}
interface Summary {
  educationLevel: string;
  course: number;
  groupCount: number;
  moduleCount: number;
  sheetCount: number;
  filledSheetCount: number;
}

const load = createLoader({
  departmentId: parseAsInteger,
  groupId: parseAsInteger,
  employeeId: parseAsInteger,
  disciplineId: parseAsInteger,
  sheetId: parseAsInteger,
});

async function getRows<T>(endpoint: string) {
  const response = await campusFetch<T[]>('/dnvr-reporting/current-control/' + endpoint);
  if (!response.ok) {
    throw new Error(`Current control request failed: ${response.status}`);
  }
  return response.json();
}

export async function CurrentControlView({ view, searchParams }: { view: View; searchParams: SearchParams }) {
  const { departmentId, groupId, employeeId, disciplineId, sheetId } = load(searchParams);
  const [modules, t, departments] = await Promise.all([
    getTranslations('global.modules'),
    getTranslations('private.dnvr-reporting'),
    getRows<Department>('departments'),
  ]);
  const department = `departments/${departmentId}`;
  const path = getCurrentControlPath(view);
  const query = { departmentId, groupId, employeeId, disciplineId, sheetId };
  const link = (label: ReactNode, next: Partial<typeof query>) => (
    <Link className="underline" href={{ pathname: path, query: { ...query, ...next } }}>
      {label}
    </Link>
  );
  let report: ReactNode = null;

  if (departmentId && sheetId) {
    const rows = await getRows<Mark>(`${department}/sheets/${sheetId}`);
    const assessments = [
      ...new Map(
        rows.flatMap((row) => (row.assessment ? [[row.assessment.id, row.assessment] as const] : [])),
      ).values(),
    ];
    const students = [...new Map(rows.map((row) => [row.student.id, row.student])).values()];
    const studentMarks = new Map(rows.map((row) => [`${row.student.id}:${row.assessment?.id}`, row.mark]));
    report = (
      <ReportTable
        headers={[t('student'), ...assessments.map((item) => `${item.name} (#${item.id})`)]}
        rows={students.map((student) => ({
          id: student.id,
          cells: [student.name, ...assessments.map((item) => studentMarks.get(`${student.id}:${item.id}`))],
        }))}
      />
    );
  } else if (departmentId && groupId && disciplineId) {
    const url = qs.stringifyUrl(
      { url: `${department}/groups/${groupId}/disciplines/${disciplineId}/sheets`, query: { employeeId } },
      { skipNull: true },
    );
    const rows = await getRows<Sheet>(url);
    report = (
      <ReportTable
        headers={[t('course'), t('group'), t('discipline'), t('sheet'), t('assessments'), t('marks'), t('lecturer')]}
        rows={rows.map((row) => ({
          id: row.employeeSheetId,
          cells: [
            row.course,
            row.group.name,
            row.discipline.name,
            link(row.name, { sheetId: row.sheetId }),
            row.assessmentCount,
            row.markCount,
            row.employee.name,
          ],
        }))}
      />
    );
  } else if (departmentId && (groupId || employeeId)) {
    const endpoint = employeeId ? `${department}/employees/${employeeId}` : `${department}/groups/${groupId}`;
    const rows = await getRows<Discipline>(`${endpoint}/disciplines`);
    const activity = employeeId ? await getRows<Activity>(`${endpoint}/activity`) : [];
    report = (
      <>
        <ReportTable
          headers={[t('group'), t('discipline'), t('workload'), t('sheets')]}
          rows={rows.map((row) => ({
            id: `${row.group.id}:${row.discipline.id}`,
            cells: [
              row.group.name,
              row.discipline.name,
              row.teachingTypes ?? row.teachingDepartment,
              link(row.sheetCount, { groupId: row.group.id, disciplineId: row.discipline.id }),
            ],
          }))}
        />
        {!!activity.length && (
          <ReportTable
            headers={[t('activity')]}
            rows={activity.map((row, index) => ({ id: index, cells: [formatDate(row.date) || EMPTY_VALUE] }))}
          />
        )}
      </>
    );
  } else if (departmentId && view === 'lecturers') {
    const rows = await getRows<Employee>(`${department}/employees`);
    report = (
      <ReportTable
        headers={[t('department'), t('lecturer'), t('status'), t('contract'), t('sheets')]}
        rows={rows.map((row) => ({
          id: row.employeeId,
          cells: [
            row.department,
            link(row.fullName, { employeeId: row.employeeId }),
            row.status,
            formatDate(row.contractEnd) || EMPTY_VALUE,
            row.sheetCount,
          ],
        }))}
      />
    );
  } else if (departmentId && (view === 'statistics' || view === 'outward')) {
    const rows = await getRows<Statistic>(`${department}/statistics?outward=${view === 'outward'}`);
    report = (
      <ReportTable
        headers={[t('discipline'), t('group'), t('department'), t('lecturer'), t('marks')]}
        rows={rows.map((row, index) => ({
          id: index,
          cells: [
            row.discipline.name,
            row.group.name,
            view === 'outward' ? row.recipientDepartment : row.teachingDepartment.name,
            row.lecturers,
            row.markCount,
          ],
        }))}
      />
    );
  } else if (departmentId && view === 'summary') {
    const [internal, outward] = await Promise.all([
      getRows<Summary>(`${department}/summary`),
      getRows<Summary>(`${department}/summary?outward=true`),
    ]);
    report = (
      <ReportTable
        headers={[
          t('departmentStatisticsType'),
          t('course'),
          t('educationLevel'),
          t('groups'),
          t('disciplines'),
          t('sheets'),
          t('filledSheets'),
        ]}
        rows={[
          ...internal.map((row) => ({ row, type: 'statistics' }) as const),
          ...outward.map((row) => ({ row, type: 'outward' }) as const),
        ].map(({ row, type }, index) => ({
          id: index,
          cells: [
            t(type),
            row.course,
            row.educationLevel,
            row.groupCount,
            row.moduleCount,
            row.sheetCount,
            row.filledSheetCount,
          ],
        }))}
      />
    );
  } else if (departmentId) {
    const rows = await getRows<Group>(`${department}/groups`);
    report = (
      <ReportTable
        headers={[t('course'), t('group'), t('disciplines'), t('sheets')]}
        rows={rows.map((row) => ({
          id: row.group.id,
          cells: [row.course, link(row.group.name, { groupId: row.group.id }), row.disciplineCount, row.sheetCount],
        }))}
      />
    );
  }

  return (
    <SubLayout pageTitle={t('currentControl')} breadcrumbs={[['/module/hignyak', modules('hignyak')]]}>
      <Card className="col-span-full flex min-w-0 flex-col gap-4 p-4 sm:p-6">
        <DnvrNavigation activeTab="current-control" />
        <Heading2>{t('currentControl')}</Heading2>
        <DnvrTabs
          activeTab={view}
          tabs={currentControlViews.map((value) => ({
            value,
            label: t(value),
            href: {
              pathname: getCurrentControlPath(value),
              query: departmentId === null ? undefined : { departmentId },
            },
          }))}
        />
        <DepartmentFilter departments={departments} departmentId={departmentId} path={path} />
        {report}
      </Card>
    </SubLayout>
  );
}
