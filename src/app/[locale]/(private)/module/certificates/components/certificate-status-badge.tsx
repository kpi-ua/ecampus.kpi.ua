import { Badge } from '@/components/ui/badge';
import { dash } from 'radash';
import { getCertificateStatusStyle } from '@/app/[locale]/(private)/module/certificates/utils';
import { useTranslations } from 'next-intl';
import { Certificate } from '@/types/models/certificate/certificate';
import { CertificateStatus } from '@/types/models/certificate/status';

interface Props {
  certificate: Certificate;
}

export function CertificateStatusBadge({ certificate }: Props) {
  const tEnums = useTranslations('global.enums');
  const isRejected = certificate.approved === false && certificate.status === CertificateStatus.Created;
  const badgeStatus = isRejected ? 'rejected' : certificate.status;
  const label = tEnums(`status.${dash(badgeStatus)}`);
  const statusVariant = getCertificateStatusStyle(certificate);

  return <Badge className={statusVariant}>{label}</Badge>;
}
