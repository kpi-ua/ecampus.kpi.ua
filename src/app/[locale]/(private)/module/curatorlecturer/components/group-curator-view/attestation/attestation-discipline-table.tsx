'use client';

import { useTranslations } from 'next-intl';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { ATTESTATION_COLUMNS } from '@/app/[locale]/(private)/module/curatorlecturer/constants';
import { CuratorAttestationDiscipline } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { EmptyRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/EmptyRow';
import { AttestationDisciplineRow } from './attestation-discipline-row';
import { LoadingRow } from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/loading-row';

interface Props {
  disciplines: CuratorAttestationDiscipline[];
  showRepeated: boolean;
  isFetching: boolean;
}

export const AttestationDisciplineTable = ({
  disciplines,
  showRepeated,
  isFetching,
}: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const colSpan = ATTESTATION_COLUMNS.length + 2 + Number(showRepeated);
  return (
    <div className="border-neutral-divider overflow-hidden rounded-lg border bg-white">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-white [&>th]:bg-neutral-100 [&>th]:text-xs [&>th]:uppercase">
            <TableHead>{t('results.discipline')}</TableHead>
            <Show when={showRepeated}>
              <TableHead>{t('results.not-attested-twice')}</TableHead>
            </Show>
            {ATTESTATION_COLUMNS.map((column) => (
              <TableHead key={column.label}>{t(`results.${column.label}`)}</TableHead>
            ))}
            <TableHead>
              <span className="sr-only">{t('results.disciplines')}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Show when={!isFetching} fallback={<LoadingRow colSpan={colSpan} />}>
            <Show when={disciplines.length > 0} fallback={<EmptyRow colSpan={colSpan} />}>
              {disciplines.map((discipline) => (
                <AttestationDisciplineRow
                  key={`${discipline.disciplineId}-${discipline.employeeId}`}
                  discipline={discipline}
                  showRepeated={showRepeated}
                />
              ))}
            </Show>
          </Show>
        </TableBody>
      </Table>
    </div>
  );
};
