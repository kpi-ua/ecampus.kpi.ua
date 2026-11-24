import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeanResponsibilities } from '@/actions/dean.actions';
import { Heading2 } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableEmptyRow, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { type LocaleProps } from '@/types/locale-props';

import { DeanDepartmentFilter } from '../../components/dean-department-filter';
import { loadDepartmentSearchParams } from '../../search-params';
import { getDeanDepartmentSelection } from '../../utils/dean-departments';

const INTL_NAMESPACE = 'private.dean';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('responsibilities'),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { departmentId } = await loadDepartmentSearchParams(searchParams);
  const { departments, selected } = await getDeanDepartmentSelection(departmentId);
  const responsibilities = await getDeanResponsibilities(selected?.id);

  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <Card className="min-w-0 rounded-t-none p-6">
      <DeanDepartmentFilter departments={departments} />
      <div className="pt-4">
        <Heading2 className="mb-4 text-xl leading-7 lg:text-xl lg:leading-7">{t('responsibilities')}</Heading2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('subsystem')}</TableHead>
              <TableHead>{t('department')}</TableHead>
              <TableHead>{t('responsiblePerson')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={responsibilities.length > 0} fallback={<TableEmptyRow colSpan={3}>{t('empty')}</TableEmptyRow>}>
              {responsibilities.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name ?? EMPTY_VALUE}</TableCell>
                  <TableCell>{row.department ?? EMPTY_VALUE}</TableCell>
                  <TableCell>{row.responsiblePerson ?? EMPTY_VALUE}</TableCell>
                </TableRow>
              ))}
            </Show>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
