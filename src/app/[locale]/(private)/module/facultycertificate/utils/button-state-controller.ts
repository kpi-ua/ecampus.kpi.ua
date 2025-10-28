import { Certificate } from '@/types/models/certificate/certificate';
import { CertificateStatus } from '@/types/models/certificate/status';

export const buttonDisableController = (certificate: Certificate) => {
  const shouldDisableApproveButton = certificate.approved !== null || certificate.status !== CertificateStatus.Created;
  const shouldDisableRejectButton = certificate.approved !== null || certificate.status !== CertificateStatus.Created;
  const shouldDisablePrintButton = certificate.status !== CertificateStatus.Processed;
  const shouldDisableSignButton = !certificate.originalRequired || certificate.status !== CertificateStatus.Processed;
  return { shouldDisableApproveButton, shouldDisableRejectButton, shouldDisablePrintButton, shouldDisableSignButton };
};
