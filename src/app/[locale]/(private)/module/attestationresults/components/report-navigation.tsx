import { getTranslations } from 'next-intl/server';
import qs from 'query-string';

import { Link } from '@/i18n/routing';

import { ATTESTATION_RESULTS_PATH, AttestationReportView } from '../constants';
import { AttestationReportQuery } from '../types';

interface Props {
  view: AttestationReportView;
  query: AttestationReportQuery;
}

export const ReportNavigation = async ({ view, query }: Props) => {
  const t = await getTranslations('private.attestation-reports');
  return (
    <nav className="flex flex-wrap gap-4" aria-label={t('title')}>
      {Object.values(AttestationReportView).map((item) => (
        <Link
          key={item}
          aria-current={view === item ? 'page' : undefined}
          className="underline"
          href={qs.stringifyUrl({
            url: `${ATTESTATION_RESULTS_PATH}/reports/${item}`,
            query: { ...query, groupId: undefined, course: undefined, studentId: undefined },
          })}
        >
          {t(`views.${item}`)}
        </Link>
      ))}
    </nav>
  );
};
