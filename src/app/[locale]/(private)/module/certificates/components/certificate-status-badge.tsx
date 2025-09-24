import { Badge } from '@/components/ui/badge';
import { dash } from 'radash';
import { getCertificateStatusStyle } from '@/app/[locale]/(private)/module/certificates/utils';
import { useTranslations } from 'next-intl';
import { DeanCertificate } from '@/types/models/dean/dean-certificate';

interface Props {
  certificate: DeanCertificate;
}

export function CertificateStatusBadge({ certificate }: Props) {
  const tEnums = useTranslations('global.enums');
  const badgeStatus = certificate.approved === false ? 'rejected' : certificate.status;
  const label = tEnums(`status.${dash(badgeStatus)}`);
  const statusVariant = getCertificateStatusStyle(certificate);

  return <Badge className={statusVariant}>{label}</Badge>;
}
