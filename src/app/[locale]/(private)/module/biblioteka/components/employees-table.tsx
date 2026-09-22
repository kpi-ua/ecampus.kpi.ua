'use client';

import { Download, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import qs from 'query-string';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Paragraph } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { Link } from '@/i18n/routing';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';
import { BibliotekaEmployee } from '@/types/models/biblioteka';

import { exportEmployees } from '../utils/export-employees';
import { IdentifierLink } from './identifier-link';

interface Props {
  employees: BibliotekaEmployee[];
  exportLabel: string;
  departmentId?: number;
}

export const EmployeesTable = ({ employees, exportLabel, departmentId }: Props) => {
  const t = useTranslations('private.biblioteka');
  const [filters, setFilters] = useState({ name: '', orcid: '', scopus: '', researcher: '', scholar: '' });
  const filtered = useMemo(() => {
    const includes = (value: string | null, query: string) => (value ?? '').toLowerCase().includes(query.toLowerCase());
    return employees.filter(
      (employee) =>
        includes(`${employee.surname} ${employee.name} ${employee.patronymic}`, filters.name) &&
        includes(employee.orcid, filters.orcid) &&
        includes(employee.scopusId, filters.scopus) &&
        includes(employee.researcherId, filters.researcher) &&
        includes(employee.googleScholarId, filters.scholar),
    );
  }, [employees, filters]);
  const { paginatedItems, page } = usePagination(PAGE_SIZE_DEFAULT, filtered);
  const setFilter = (key: keyof typeof filters, value: string) =>
    setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="border-neutral-divider min-w-0 overflow-hidden rounded-lg border bg-white shadow-none">
      <Table className="min-w-[1050px]">
        <TableHeader>
          <TableRow className="hover:bg-white [&>th]:bg-neutral-50 [&>th]:text-xs [&>th]:normal-case">
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>ORCID</TableHead>
            <TableHead>Scopus ID</TableHead>
            <TableHead>Researcher ID</TableHead>
            <TableHead>Google Scholar</TableHead>
            <TableHead className="w-36">{t('table.actions')}</TableHead>
          </TableRow>
          <TableRow className="hover:bg-white [&>th]:border-neutral-200">
            <TableHead className="h-auto bg-white p-3">
              <Input
                value={filters.name}
                onChange={(e) => setFilter('name', e.target.value)}
                placeholder={t('search')}
              />
            </TableHead>
            <TableHead className="h-auto bg-white p-3">
              <Input value={filters.orcid} onChange={(e) => setFilter('orcid', e.target.value)} placeholder="ORCID" />
            </TableHead>
            <TableHead className="h-auto bg-white p-3">
              <Input
                value={filters.scopus}
                onChange={(e) => setFilter('scopus', e.target.value)}
                placeholder="Scopus"
              />
            </TableHead>
            <TableHead className="h-auto bg-white p-3">
              <Input
                value={filters.researcher}
                onChange={(e) => setFilter('researcher', e.target.value)}
                placeholder="WoS"
              />
            </TableHead>
            <TableHead className="h-auto bg-white p-3">
              <Input
                value={filters.scholar}
                onChange={(e) => setFilter('scholar', e.target.value)}
                placeholder="Scholar"
              />
            </TableHead>
            <TableHead className="h-auto bg-white p-3">
              <Button
                className="w-full"
                variant="secondary"
                size="small"
                onClick={() => exportEmployees(filtered, exportLabel, t('table.name'))}
              >
                <Download />
                {t('export')}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((employee) => (
            <TableRow key={`${employee.employeeId}-${employee.userAccountId}`}>
              <TableCell className="font-medium">
                {employee.surname} {employee.name} {employee.patronymic}
              </TableCell>
              <TableCell>
                <IdentifierLink value={employee.orcid} href="https://orcid.org/" />
              </TableCell>
              <TableCell>
                <IdentifierLink value={employee.scopusId} href="https://www.scopus.com/authid/detail.uri?authorId=" />
              </TableCell>
              <TableCell>
                <IdentifierLink value={employee.researcherId} href="https://www.webofscience.com/wos/author/record/" />
              </TableCell>
              <TableCell>
                <IdentifierLink value={employee.googleScholarId} href="https://scholar.google.com/citations?user=" />
              </TableCell>
              <TableCell>
                <Button asChild variant="secondary" size="small">
                  <Link
                    href={qs.stringifyUrl({
                      url: `/module/biblioteka/employees/${employee.employeeId}`,
                      query: {
                        userAccountId: employee.userAccountId ?? undefined,
                        departmentId,
                      },
                    })}
                  >
                    <Pencil />
                    {t('table.edit')}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Paragraph className="border-neutral-divider m-0 border-t px-5 py-4 text-sm leading-6 text-neutral-600">
        {t('count', { count: filtered.length })}
      </Paragraph>
      <Show when={filtered.length > PAGE_SIZE_DEFAULT}>
        <div className="border-neutral-divider border-t px-5 py-4">
          <PaginationWithLinks page={page} pageSize={PAGE_SIZE_DEFAULT} totalCount={filtered.length} />
        </div>
      </Show>
    </div>
  );
};
