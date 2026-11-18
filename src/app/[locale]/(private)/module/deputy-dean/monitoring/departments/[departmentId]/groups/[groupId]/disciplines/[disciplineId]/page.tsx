import { getTranslations } from 'next-intl/server';

import { getDeputyDeanSheets } from '@/actions/deputy-dean.actions';
import { DeputyDeanTableCard } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-table-card';
import { DeputyDeanTabs } from '@/app/[locale]/(private)/module/deputy-dean/components/deputy-dean-tabs';
import { DeputyDeanView } from '@/app/[locale]/(private)/module/deputy-dean/constants';
import { getDeputyDeanReportPath } from '@/app/[locale]/(private)/module/deputy-dean/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';
const INTL_NAMESPACE = 'private.deputy-dean';
export const dynamic = 'force-dynamic';
interface Props {
  params: Promise<{ locale: string; departmentId: string; groupId: string; disciplineId: string }>;
}
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('views.sheets') };
}
export default async function MonitoringPage({ params }: Props) {
  const route = await params;
  const departmentId = Number(route.departmentId);
  const groupId = Number(route.groupId);
  const disciplineId = Number(route.disciplineId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getDeputyDeanSheets(groupId, disciplineId);
  return (
    <SubLayout
      pageTitle={t('views.sheets')}
      breadcrumbs={[
        [getDeputyDeanReportPath({ view: DeputyDeanView.Groups }), t('title')],
        [getDeputyDeanReportPath({ view: DeputyDeanView.GroupLoad, departmentId, groupId }), t('navigation.group')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <DeputyDeanTabs section="monitoring">
          <Heading3>{t('views.sheets')}</Heading3>
          <Show when={items.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
            <DeputyDeanTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('columns.course')}</TableHead>
                    <TableHead>{t('columns.group')}</TableHead>
                    <TableHead>{t('columns.reportModule')}</TableHead>
                    <TableHead>{t('columns.sheetName')}</TableHead>
                    <TableHead>{t('columns.assessmentCount')}</TableHead>
                    <TableHead>{t('columns.markCount')}</TableHead>
                    <TableHead>{t('columns.employee')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-pre-wrap">{row.course}</TableCell>
                      <TableCell className="whitespace-pre-wrap">{row.group}</TableCell>
                      <TableCell className="whitespace-pre-wrap">{row.discipline}</TableCell>
                      <TableCell className="whitespace-pre-wrap">
                        <Link
                          className="underline"
                          href={getDeputyDeanReportPath({
                            view: DeputyDeanView.Sheet,
                            departmentId,
                            groupId: row.groupId,
                            disciplineId: row.disciplineId,
                            monitoringId: row.sheetId,
                          })}
                        >
                          {row.name}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-pre-wrap">{row.assessmentCount}</TableCell>
                      <TableCell className="whitespace-pre-wrap">{row.markCount}</TableCell>
                      <TableCell className="whitespace-pre-wrap">{row.employee}</TableCell>
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
