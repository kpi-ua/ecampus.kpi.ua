import { CertificateStatus } from '@/types/models/certificate/status';
import { Certificate } from '@/types/models/certificate/certificate';

export function getCertificateStatusStyle(certificate: Certificate) {
  if (certificate.approved && certificate.status === CertificateStatus.Processed) {
    return 'success';
  }
  if (certificate.status === CertificateStatus.Error || certificate.approved === false) {
    return 'error';
  }
  if (certificate.status === CertificateStatus.Created) {
    return 'warning';
  }
  return 'default';
}
