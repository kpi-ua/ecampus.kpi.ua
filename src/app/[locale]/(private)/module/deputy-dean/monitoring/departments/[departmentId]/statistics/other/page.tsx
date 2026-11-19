import { getTranslations } from 'next-intl/server';

import { getDeputyDeanOtherDepartmentStatistics } from '@/actions/deputy-dean.actions';
import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
const INTL_NAMESPACE = 'private.deputy-dean';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string; departmentId: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('navigation.outwardStatistics') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = Number(route.departmentId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getDeputyDeanOtherDepartmentStatistics(departmentId);
  return (
    <SubLayout
      pageTitle={t('navigation.outwardStatistics')}
      breadcrumbs={[[getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')]]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('navigation.outwardStatistics')}</Heading3>
          <Show when={items.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
            <DeputyDeanTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('columns.curriculumRow')}</TableHead>

                    <TableHead>{t('columns.group')}</TableHead>
                    <TableHead>{t('columns.reportRecipientDepartment')}</TableHead>
                    <TableHead>{t('columns.reportName')}</TableHead>
                    <TableHead>{t('columns.reportMarkCount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.discipline}</TableCell>

                      <TableCell>{row.group}</TableCell>
                      <TableCell>{row.recipientDepartment}</TableCell>
                      <TableCell>{row.lecturers}</TableCell>
                      <TableCell>{row.markCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DeputyDeanTableCard>
          </Show>
        </DeputyDeanTabs>
      </div>
    </SubLayout>
  );
}
