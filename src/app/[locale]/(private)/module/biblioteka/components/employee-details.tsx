'use client';

import { useQuery } from '@tanstack/react-query';
import { BriefcaseBusiness, ChartNoAxesColumnIncreasing } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getBibliotekaEmployee } from '@/actions/biblioteka.actions';
import { Heading6, Paragraph } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BibliotekaEmployeeDetails } from '@/types/models/biblioteka';

import { BIBLIOTEKA_STALE_TIME, bibliotekaQueryKeys } from '../query-keys';
import { EntityHeading } from './entity-heading';
import { IdentifierRow } from './identifier-row';

interface Props {
  initialDetails: BibliotekaEmployeeDetails;
}

export const EmployeeDetails = ({ initialDetails }: Props) => {
  const t = useTranslations('private.biblioteka');
  const { data: details } = useQuery({
    queryKey: bibliotekaQueryKeys.employee(initialDetails.userAccountId, initialDetails.employeeId),
    queryFn: () => getBibliotekaEmployee(initialDetails.userAccountId, initialDetails.employeeId),
    initialData: initialDetails,
    staleTime: BIBLIOTEKA_STALE_TIME,
  });

  return (
    <div className="flex flex-col gap-8">
      <EntityHeading
        title={details.fullName}
        description={t('employee.description')}
      />
      <section className="flex flex-col gap-4">
        <Heading6 className="flex items-center gap-2 text-sm leading-6 text-neutral-600 lg:text-sm lg:leading-6">
          <BriefcaseBusiness className="size-4" />
          {t('employment')}
        </Heading6>
        <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white shadow-none">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="hover:bg-white [&>th]:bg-neutral-50 [&>th]:text-xs [&>th]:normal-case">
                <TableHead>{t('table.surname')}</TableHead>
                <TableHead>{t('table.first-name')}</TableHead>
                <TableHead>{t('table.patronymic')}</TableHead>
                <TableHead>{t('table.subdivision')}</TableHead>
                <TableHead>{t('table.sector')}</TableHead>
                <TableHead>{t('table.position')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.contract')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.employments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.surname}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.patronymic}</TableCell>
                  <TableCell>{item.subdivisionName}</TableCell>
                  <TableCell>{item.sectorName}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>
                    <Badge variant="yellow">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.contractEnd ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <Heading6 className="flex items-center gap-2 text-sm leading-6 text-neutral-600 lg:text-sm lg:leading-6">
          <ChartNoAxesColumnIncreasing className="size-4" />
          {t('identifiers')}
        </Heading6>
        {details.userAccountId ? (
          <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white shadow-none">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="hover:bg-white [&>th]:bg-neutral-50 [&>th]:text-xs [&>th]:normal-case">
                  <TableHead>{t('table.database')}</TableHead>
                  <TableHead>{t('table.value')}</TableHead>
                  <TableHead>{t('table.updated')}</TableHead>
                  <TableHead>{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.identifiers.map((identifier) => (
                  <IdentifierRow
                    key={identifier.contactTypeId}
                    identifier={identifier}
                    userAccountId={details.userAccountId!}
                    employeeId={details.employeeId}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Paragraph className="m-0 text-sm text-neutral-600">{t('no-account')}</Paragraph>
        )}
      </section>
    </div>
  );
};
