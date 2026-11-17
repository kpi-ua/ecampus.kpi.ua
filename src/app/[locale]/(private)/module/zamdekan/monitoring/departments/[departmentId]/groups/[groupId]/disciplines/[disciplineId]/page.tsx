import { getTranslations } from 'next-intl/server';

import { getZamdekanSheets } from '@/actions/zamdekan.actions';
import { ZamdekanTableCard } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-table-card';
import { ZamdekanTabs } from '@/app/[locale]/(private)/module/zamdekan/components/zamdekan-tabs';
import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { Link } from '@/i18n/routing';
const INTL_NAMESPACE = 'private.zamdekan';
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
  const departmentId = parseReportId(route.departmentId);
  const groupId = parseReportId(route.groupId);
  const disciplineId = parseReportId(route.disciplineId);
  const t = await getTranslations(INTL_NAMESPACE);
  const items = await getZamdekanSheets(groupId, disciplineId);
  return (
    <SubLayout
      pageTitle={t('views.sheets')}
      breadcrumbs={[
        [getZamdekanReportPath({ view: 'groups' }), t('title')],
        [getZamdekanReportPath({ view: 'group-load', departmentId, groupId }), t('navigation.group')],
      ]}
    >
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <Heading2>{t('title')}</Heading2>
        <ZamdekanTabs section="monitoring">
          <Heading3>{t('views.sheets')}</Heading3>
          <Show when={items.length > 0} fallback={<Paragraph>{t('empty')}</Paragraph>}>
            <ZamdekanTableCard>
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
                          href={getZamdekanReportPath({
                            view: 'sheet',
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
            </ZamdekanTableCard>
          </Show>
        </ZamdekanTabs>
      </div>
    </SubLayout>
  );
}
