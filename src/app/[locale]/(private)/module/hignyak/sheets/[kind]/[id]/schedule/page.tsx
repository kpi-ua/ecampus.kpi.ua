import { getTranslations } from 'next-intl/server';

import { getDnvrSheet } from '@/actions/dnvr-sheets.actions';
import { Heading2 } from '@/components/typography';
import { Link } from '@/i18n/routing';

import { ReportTable } from '../../../../components/report-table';
import { getDnvrSheetsPath, getSheetKind, getSheetRouteId } from '../../../sheet-routes';
import { formatSheetDate } from '../../components/sheet-date';
import { SheetScheduleForm } from '../../components/sheet-schedule-form';

export default async function Page({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const input = await params;
  const kind = getSheetKind(input.kind);
  const id = getSheetRouteId(input.id);
  const [t, { sheet, history }] = await Promise.all([
    getTranslations('private.dnvr-reporting'),
    getDnvrSheet(kind, id),
  ]);

  return (
    <>
      <Heading2>{t('extendSheet')}</Heading2>
      <Link className="self-start underline" href={`${getDnvrSheetsPath(kind)}/${id}`}>
        {t('sheetNumber', { id })}
      </Link>
      <SheetScheduleForm kind={kind} sheet={sheet} />
      <Heading2>{t('sheetHistory')}</Heading2>
      <ReportTable
        headers={[t('changeDate'), t('changedBy'), t('reason')]}
        rows={history.map((row, index) => ({
          id: index,
          cells: [formatSheetDate(row.date), row.changedBy, row.description],
        }))}
      />
    </>
  );
}
