import { getTranslations } from 'next-intl/server';
import qs from 'query-string';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <Tabs value={view} activationMode="manual">
      <div className="overflow-x-auto">
        <TabsList className="bg-white" size="small" aria-label={t('title')}>
          {Object.values(AttestationReportView).map((item) => (
            <TabsTrigger key={item} value={item} asChild>
              <Link
                prefetch={false}
                href={qs.stringifyUrl({
                  url: `${ATTESTATION_RESULTS_PATH}/reports/${item}`,
                  query: { ...query, groupId: undefined, course: undefined, studentId: undefined },
                })}
              >
                {t(`views.${item}`)}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};
