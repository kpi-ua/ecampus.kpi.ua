import { Badge } from '@/components/ui/badge';
import { dash } from 'radash';
import { getCertificateStatusStyle } from '@/app/[locale]/(private)/module/certificates/utils';
import { useTranslations } from 'next-intl';
import { Certificate } from '@/types/models/certificate/certificate';

interface Props {
  certificate: Certificate;
}

export function CertificateStatusBadge({ certificate }: Props) {
  const t = useTranslations('private.certificate');
  const badgeStatus = certificate.approved === false ? 'rejected' : certificate.status;
  const label = t(`status.${dash(badgeStatus)}`);
  const statusVariant = getCertificateStatusStyle(certificate);

  return <Badge className={statusVariant}>{label}</Badge>;
}
