import { Certificate } from '@/types/models/certificate/certificate';
import { CertificateStatus } from '@/types/models/certificate/status';

export const buttonDisableController = (certificate: Certificate) => {
  const isElectronic = !certificate.originalRequired;
  const hasPdf =
    certificate.status === CertificateStatus.Processed || certificate.status === CertificateStatus.Signed;

  // Approve/Reject: only when status is Created
  const shouldDisableApproveButton = certificate.status !== CertificateStatus.Created;
  const shouldDisableRejectButton = certificate.status !== CertificateStatus.Created;

  // Print (with stamp): available when Processed or Signed
  const shouldDisablePrintButton = !hasPdf;

  // Print unsigned (no stamp): only for electronic certificates when Processed or Signed
  const shouldDisablePrintUnsignedButton = !isElectronic || !hasPdf;

  // Sign: only for paper certificates when Processed
  const shouldDisableSignButton = isElectronic || certificate.status !== CertificateStatus.Processed;

  // Regenerate: only when Pending or Error
  const shouldDisableRegenerateButton =
    certificate.status !== CertificateStatus.Pending && certificate.status !== CertificateStatus.Error;

  // Preview: available when PDF exists (Processed or Signed) for electronic certificates
  const shouldDisablePreviewButton = !isElectronic || !hasPdf;

  return {
    shouldDisableApproveButton,
    shouldDisableRejectButton,
    shouldDisablePrintButton,
    shouldDisablePrintUnsignedButton,
    shouldDisableSignButton,
    shouldDisableRegenerateButton,
    shouldDisablePreviewButton,
  };
};
