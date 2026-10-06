import { parseReportId } from '@/app/[locale]/(private)/module/zamdekan/utils/parse-report-id';
import { getZamdekanReportPath } from '@/app/[locale]/(private)/module/zamdekan/utils/report-path';
import { redirect } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string; groupId: string; studentId: string }>;
}

export default async function LegacyAgreementsPage({ params }: Props) {
  const { locale, groupId, studentId } = await params;
  redirect({
    locale,
    href: getZamdekanReportPath({
      view: 'results',
      groupId: parseReportId(groupId),
      studentId: parseReportId(studentId),
    }),
  });
}
