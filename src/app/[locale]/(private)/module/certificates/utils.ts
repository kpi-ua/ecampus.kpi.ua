import { CertificateStatus } from '@/types/models/certificate/status';
import { badgeVariants } from '@/components/ui/badge';
import { DeanCertificate } from '@/types/models/dean/dean-certificate';

export function getCertificateStatusStyle(certificate: DeanCertificate) {
  if (certificate.approved && certificate.status === CertificateStatus.Processed) {
    return badgeVariants({ variant: 'success' });
  }
  if (certificate.status === CertificateStatus.Error || certificate.approved === false) {
    return badgeVariants({ variant: 'error' });
  }
  if (certificate.status === CertificateStatus.Created) {
    return badgeVariants({ variant: 'yellow' });
  }
  return badgeVariants({ variant: 'default' });
}
