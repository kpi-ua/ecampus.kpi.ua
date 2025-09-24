import { DeanCertificate } from '@/types/models/dean/dean-certificate';
import { CertificateStatus } from '@/types/models/certificate/status';

export const buttonDisableController = (certificate: DeanCertificate) => {
  const shouldDisableApproveButton = certificate.approved !== null || certificate.status !== CertificateStatus.Created;
  const shouldDisableRejectButton = certificate.approved !== null || certificate.status !== CertificateStatus.Created;
  const shouldDisablePrintButton = certificate.status !== CertificateStatus.Processed;
  return { shouldDisableApproveButton, shouldDisableRejectButton, shouldDisablePrintButton };
};
