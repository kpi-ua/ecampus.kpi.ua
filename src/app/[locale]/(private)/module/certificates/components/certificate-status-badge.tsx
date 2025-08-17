import { Badge } from '@/components/ui/badge';
import { dash } from 'radash';
import { cn } from '@/lib/utils';
import { CertificateStatus } from '@/types/models/certificate/status';
import { getCertificateStatusStyle } from '@/app/[locale]/(private)/module/certificates/utils';
import { useTranslations } from 'next-intl';

interface Props {
  className?: string;
  status: CertificateStatus;
}

export function CertificateStatusBadge({ className, status }: Props) {
  const tEnums = useTranslations('global.enums');
  const label = tEnums(`status.${dash(status)}`);
  const statusStyle = getCertificateStatusStyle(status);

  return <Badge className={cn(className, statusStyle)}>{label}</Badge>;
}
