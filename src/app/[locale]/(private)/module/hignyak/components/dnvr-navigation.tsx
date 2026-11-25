import { useTranslations } from 'next-intl';

import { DNVR_PATH, getAttestationPath, getCurrentControlPath } from '../routes';
import { DnvrTabs } from './dnvr-tabs';

export function DnvrNavigation({
  activeTab,
}: {
  activeTab: 'student-counts' | 'attestation' | 'sheets' | 'current-control';
}) {
  const t = useTranslations('private.dnvr-reporting');

  return (
    <DnvrTabs
      activeTab={activeTab}
      tabs={[
        { value: 'student-counts', label: t('studentCounts'), href: DNVR_PATH },
        { value: 'attestation', label: t('attestationReports'), href: getAttestationPath() },
        { value: 'sheets', label: t('sheets'), href: DNVR_PATH + '/sheets' },
        { value: 'current-control', label: t('currentControl'), href: getCurrentControlPath() },
      ]}
    />
  );
}
