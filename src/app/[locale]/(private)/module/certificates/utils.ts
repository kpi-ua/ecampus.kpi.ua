import { CertificateStatus } from '@/types/models/certificate/status';

const STATUS_STYLES = {
  success: 'border-green-300 bg-green-100 text-green-600',
  error: 'border-red-300 bg-red-100 text-red-600',
  default: 'border-gray-300 bg-gray-100 text-gray-600',
} as const;

export function getCertificateStatusStyle(status: CertificateStatus) {
  switch (status) {
    case CertificateStatus.Approved:
      return STATUS_STYLES.success;
    case CertificateStatus.Error:
    case CertificateStatus.Rejected:
      return STATUS_STYLES.error;
    case CertificateStatus.Created:
    case CertificateStatus.InQueue:
      return STATUS_STYLES.default;
    default:
      return STATUS_STYLES.default;
  }
}
