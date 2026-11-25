import { getTranslations } from 'next-intl/server';

import { getDnvrSheetFaculties } from '@/actions/dnvr-sheets.actions';
import { Heading2 } from '@/components/typography';
import { Link } from '@/i18n/routing';

import { ReportTable } from '../../components/report-table';
import { getDnvrSheetsPath, getSheetKind } from '../sheet-routes';

export default async function Page({ params }: { params: Promise<{ kind: string }> }) {
  const kind = getSheetKind((await params).kind);
  const [t, faculties] = await Promise.all([getTranslations('private.dnvr-reporting'), getDnvrSheetFaculties(kind)]);
  const path = getDnvrSheetsPath(kind);

  return (
    <>
      <Heading2>{t('sheetMonitoring')}</Heading2>
      <ReportTable
        headers={[t('faculty'), t('assessments'), t('createdSheets'), t('blockedSheets')]}
        rows={faculties.map((row) => ({
          id: `${row.facultyId}:${row.assessment ?? ''}`,
          cells: [
            <Link key="faculty" className="underline" href={`${path}/faculties/${row.facultyId}`}>
              {row.faculty}
            </Link>,
            row.assessment,
            row.createdCount,
            row.blockedCount,
          ],
        }))}
      />
    </>
  );
}
