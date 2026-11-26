import { getFormatter, getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { campusFetch } from '@/lib/client';

import { AttestationFilters } from './attestation-filters';
import { ResultForm } from './result-form';

type Item = { id: number; name: string };
type Period = {
  id: number;
  semester: number;
  number: number;
  isOpen: boolean;
  hasEnded: boolean;
  dateStart: string;
  dateEnd: string;
};
type Progress = { periodId: number; hasResults: boolean; hasOwnResults: boolean };
type Load = {
  id: number;
  discipline: Item;
  group: Item;
  department?: Item | null;
  responsibleLecturer: Item;
  lecturers?: Item[];
  progress?: Progress[];
};
type StudentResult = { student: Item; result: string | null };
type Sheet = { canEdit: boolean; students: StudentResult[] };
type Filters = {
  semester?: string;
  department?: string;
  load?: string;
};

const endpoint = '/attestation/lecturer';
const modulePath = '/module/attestation';
const namespace = 'private.lecturer-attestation';
const statusColors = {
  'own-open': 'bg-green-300',
  'own-closed': 'bg-green-700',
  'other-open': 'bg-blue-300',
  'other-closed': 'bg-blue-700',
  'missing-open': 'bg-red-400',
  'missing-closed': 'bg-red-800',
} as const;

function moduleLink(filters: Filters) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      query.set(key, value);
    }
  }
  return modulePath + (query.size ? `?${query}` : '');
}

export async function generateMetadata() {
  const t = await getTranslations(namespace);
  return { title: t('title') };
}

export default async function LecturerAttestationPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const [t, format, filters] = await Promise.all([getTranslations(namespace), getFormatter(), searchParams]);

  async function read<T>(path: string): Promise<T> {
    const response = await campusFetch<T>(path);
    if (!response.ok) {
      throw new Error(`${t('load-error')} (HTTP ${response.status})`);
    }
    return response.json();
  }

  const periods = await read<Period[]>(`${endpoint}/periods`);
  const openPeriods = periods.filter(({ isOpen }) => isOpen);
  const startedPeriods = periods.filter(({ dateStart }) => new Date(dateStart).getTime() <= Date.now());
  const semester =
    filters.semester === '1' || filters.semester === '2'
      ? Number(filters.semester)
      : (openPeriods[0]?.semester ?? startedPeriods.at(-1)?.semester ?? periods[0]?.semester ?? 1);
  const visiblePeriods = [1, 2].map((number) =>
    periods.find((period) => period.semester === semester && period.number === number),
  );
  const loads = await read<Load[]>(`${endpoint}/loads?semester=${semester}`);
  const departments = [
    ...new Map(loads.flatMap(({ department }) => (department ? [[department.id, department] as const] : []))).values(),
  ];
  const department = departments.find(({ id }) => id === Number(filters.department));
  const departmentLoads = department ? loads.filter((load) => load.department?.id === department.id) : loads;
  const load = departmentLoads.find(({ id }) => id === Number(filters.load));
  const sheets = load
    ? await Promise.all(
        visiblePeriods.map((period) =>
          period ? read<Sheet>(`${endpoint}/loads/${load.id}/periods/${period.id}`) : null,
        ),
      )
    : [];
  const marks = sheets.map((sheet) => new Map(sheet?.students.map(({ student, result }) => [student.id, result])));
  const students = [
    ...new Map(
      sheets.flatMap((sheet) => sheet?.students.map(({ student }) => [student.id, student] as const) ?? []),
    ).values(),
  ];
  const loadNames = (row: Load) => (row.lecturers?.length ? row.lecturers : [row.responsibleLecturer]);
  const compare = (left: string, right: string) => left.localeCompare(right, 'uk');
  departmentLoads.sort((left, right) => compare(left.discipline.name, right.discipline.name));
  students.sort((left, right) => compare(left.name, right.name));

  const overview = {
    semester: String(semester),
    department: department ? String(department.id) : undefined,
  };

  async function save(
    loadId: number,
    periodId: number,
    studentId: number,
    _state: { status: number; saved: boolean } | null,
    data: FormData,
  ) {
    'use server';

    const result = data.get('result');
    if (result !== 'a' && result !== 'na' && result !== 'nv') {
      return { status: 400, saved: false };
    }

    const response = await campusFetch(`${endpoint}/loads/${loadId}/periods/${periodId}/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({ result }),
    });
    if (response.ok) {
      revalidatePath('/[locale]/(private)/module/attestation', 'page');
    }

    return { status: response.status, saved: response.ok };
  }

  return (
    <SubLayout pageTitle={t('title')}>
      <Card className="col-span-full min-w-0 space-y-4 p-4 sm:space-y-5 sm:p-6">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        {openPeriods.map((period) => (
          <p key={period.id} className="rounded bg-blue-50 px-4 py-2.5 text-sm leading-relaxed text-blue-950">
            {t('period-open', {
              number: period.number,
              start: format.dateTime(new Date(period.dateStart), { dateStyle: 'medium', timeZone: 'UTC' }),
              end: format.dateTime(new Date(period.dateEnd), { dateStyle: 'medium', timeZone: 'UTC' }),
            })}
          </p>
        ))}

        {load && (
          <div className="space-y-3">
            <Link className="inline-block text-sm underline underline-offset-4" href={moduleLink(overview)}>
              {t('back')}
            </Link>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-md bg-muted/40 px-3 py-2.5 text-sm sm:px-4">
              <dt>{t('discipline')}</dt>
              <dd className="font-semibold">{load.discipline.name}</dd>
              <dt>{t('group')}</dt>
              <dd className="font-semibold">{load.group.name}</dd>
              <dt>{t('responsible')}</dt>
              <dd className="font-semibold">{load.responsibleLecturer.name}</dd>
            </dl>
            {!sheets.some((sheet) => sheet?.canEdit) && (
              <p className="text-sm text-muted-foreground">{t('read-only')}</p>
            )}
          </div>
        )}

        {!load && <AttestationFilters departments={departments} departmentId={department?.id} semester={semester} />}

        {!load && (
          <details className="text-sm">
            <summary className="cursor-pointer">{t('progress-legend')}</summary>
            <ul className="mt-2 space-y-1">
              {Object.entries(statusColors).map(([status, color]) => (
                <li key={status} className="flex items-center gap-2">
                  <span className={`size-3 rounded-full ${color}`} />
                  {t(status as keyof typeof statusColors)}
                </li>
              ))}
            </ul>
          </details>
        )}

        {load ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('student')}</TableHead>
                {[1, 2].map((number) => (
                  <TableHead key={number} className="w-48">
                    {t('attestation-number', { number })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="even:bg-muted/30 [&>td]:px-2 [&>td]:py-1">
                  <TableCell>{student.name}</TableCell>
                  {visiblePeriods.map((period, column) => {
                    const result = marks[column]?.get(student.id) ?? null;
                    return (
                      <TableCell key={column}>
                        {period && sheets[column]?.canEdit && marks[column]?.has(student.id) ? (
                          <ResultForm
                            key={`${load.id}-${period.id}-${student.id}`}
                            save={save.bind(null, load.id, period.id, student.id)}
                            student={student.name}
                            result={result}
                          />
                        ) : (
                          <span className="px-2">
                            {result === 'a' || result === 'na' || result === 'nv' ? t(result) : '—'}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {!students.length && (
                <TableRow>
                  <TableCell colSpan={3}>{t('no-students')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>{t('department')}</TableHead>
                <TableHead>{t('discipline')}</TableHead>
                <TableHead>{t('group')}</TableHead>
                <TableHead>{t('lecturers')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentLoads.map((row, index) => (
                <TableRow key={row.id} className="even:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {index + 1}
                      {visiblePeriods.map((period, column) => {
                        const progress = row.progress?.find(({ periodId }) => periodId === period?.id);
                        const status =
                          !period || !row.progress || (!period.isOpen && !period.hasEnded)
                            ? null
                            : (`${progress?.hasOwnResults ? 'own' : progress?.hasResults ? 'other' : 'missing'}-${period.isOpen ? 'open' : 'closed'}` as const);
                        const label = `${t('attestation-number', { number: column + 1 })}: ${status ? t(status) : t('no-progress')}`;
                        return (
                          <span
                            key={column}
                            role="img"
                            aria-label={label}
                            title={label}
                            className={`size-3 rounded-full ${status ? statusColors[status] : 'bg-muted-foreground/30'}`}
                          />
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{row.department?.name ?? '—'}</TableCell>
                  <TableCell>
                    <Link className="underline" href={moduleLink({ ...overview, load: String(row.id) })}>
                      {row.discipline.name}
                    </Link>
                  </TableCell>
                  <TableCell>{row.group.name}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {loadNames(row).map(({ id, name }) => (
                        <li key={id} className={id === row.responsibleLecturer.id ? 'font-semibold' : undefined}>
                          {name}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
              {!departmentLoads.length && (
                <TableRow>
                  <TableCell colSpan={5}>{t('empty')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </SubLayout>
  );
}
