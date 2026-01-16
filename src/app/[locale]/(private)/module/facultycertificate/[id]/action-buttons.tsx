'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowClockwise, CaretDownRegular, Check, EyeRegular, PencilRegular, Printer, X } from '@/app/images';
import {
  downloadCertificate,
  downloadUnsignedCertificate,
  printCertificate,
  printUnsignedCertificate,
} from '@/app/[locale]/(private)/module/facultycertificate/utils/print-certificate';
import {
  regenerateCertificate,
  signCertificate,
  updateCertificate,
  UpdateCertificateBody,
} from '@/actions/certificates.actions';
import { Certificate } from '@/types/models/certificate/certificate';
import { CertificateSignatory } from '@/types/models/certificate/signatory';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { buttonDisableController } from '@/app/[locale]/(private)/module/facultycertificate/utils/button-state-controller';
import { RejectDialog } from '@/app/[locale]/(private)/module/facultycertificate/components/reject-dialog';
import { PreviewDialog } from '@/app/[locale]/(private)/module/facultycertificate/components/preview-dialog';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Props {
  certificate: Certificate;
  signatories: CertificateSignatory[];
  canEditOperatorFields: boolean;
  variant?: 'full' | 'approval-only' | 'secondary-only';
}

export default function ActionButtons({ certificate, signatories, canEditOperatorFields, variant = 'full' }: Props) {
  const t = useTranslations('private.facultycertificate');
  const tOperator = useTranslations('private.facultycertificate.operator');
  const { errorToast } = useServerErrorToast();
  const router = useRouter();

  const [operatorNotes, setOperatorNotes] = useState(certificate.operatorNotes || '');
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string>(
    certificate.signatoryId?.toString() || signatories.find((s) => s.isDefault)?.id.toString() || '',
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleUpdateCertificate = async (id: number, body: UpdateCertificateBody) => {
    try {
      await updateCertificate(id, body);
    } catch (error) {
      errorToast();
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const body: UpdateCertificateBody = {
        approve: true,
        reason: '',
        notes: operatorNotes || undefined,
        signatoryId: selectedSignatoryId ? parseInt(selectedSignatoryId, 10) : undefined,
      };
      await handleUpdateCertificate(certificate.id, body);
    } finally {
      setIsApproving(false);
    }
  };

  const handleSign = async () => {
    setIsSigning(true);
    try {
      await signCertificate(certificate.id);
    } catch (error) {
      errorToast();
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = async () => {
    try {
      await printCertificate(certificate.id);
    } catch (error) {
      errorToast();
    }
  };

  const handleDownload = async () => {
    try {
      await downloadCertificate(certificate.id);
    } catch (error) {
      errorToast();
    }
  };

  const handlePrintUnsigned = async () => {
    try {
      await printUnsignedCertificate(certificate.id);
    } catch (error) {
      errorToast();
    }
  };

  const handleDownloadUnsigned = async () => {
    try {
      await downloadUnsignedCertificate(certificate.id);
    } catch (error) {
      errorToast();
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await regenerateCertificate(certificate.id);
    } catch (error) {
      errorToast();
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 5000));
    router.refresh();
    await minDelay;
    setIsRefreshing(false);
  };

  const {
    shouldDisableRejectButton,
    shouldDisableSignButton,
    shouldDisablePrintButton,
    shouldDisablePrintUnsignedButton,
    shouldDisableApproveButton,
    shouldDisableRegenerateButton,
    shouldDisablePreviewButton,
  } = buttonDisableController(certificate);

  const showOperatorFields = canEditOperatorFields && (variant === 'full' || variant === 'approval-only');
  const showSecondaryButtons = variant === 'full' || variant === 'secondary-only';
  const showApprovalButtons = variant === 'full' || variant === 'approval-only';

  return (
    <div className="flex flex-col gap-6">
      {/* Operator fields - only shown when certificate is in Created status */}
      {showOperatorFields && (
        <div className="flex flex-col gap-4">
          {/* Signatory selection */}
          {signatories.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="signatory">{tOperator('signatory')}</Label>
              <Select value={selectedSignatoryId} onValueChange={setSelectedSignatoryId}>
                <SelectTrigger id="signatory">
                  <SelectValue placeholder={tOperator('selectSignatory')} />
                </SelectTrigger>
                <SelectContent>
                  {signatories.map((signatory) => (
                    <SelectItem key={signatory.id} value={signatory.id.toString()}>
                      {signatory.fullName} — {signatory.position}
                      {signatory.isDefault && ` (${tOperator('defaultSignatory')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Operator notes */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="operatorNotes">{tOperator('notes')}</Label>
            <Textarea
              id="operatorNotes"
              className="resize-none"
              placeholder={tOperator('notesPlaceholder')}
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value.slice(0, 500))}
              maxLength={500}
            />
            <span className="text-xs text-neutral-400">{operatorNotes.length}/500</span>
          </div>
        </div>
      )}

      {/* Secondary action buttons (refresh, regenerate, preview, print) */}
      {showSecondaryButtons && (
        <div className="flex flex-col-reverse flex-wrap gap-3 md:flex-row md:justify-end">
          <Button variant="secondary" className="mt-6 w-full md:w-[145px]" icon={<ArrowClockwise />} loading={isRefreshing} onClick={handleRefresh}>
            {t('button.refresh')}
          </Button>
          <Button
            variant="secondary"
            className="mt-6 w-full md:w-[170px]"
            onClick={handleRegenerate}
            disabled={shouldDisableRegenerateButton}
            loading={isRegenerating}
          >
            {t('button.regenerate')}
          </Button>
          <PreviewDialog
            certificateId={certificate.id}
            triggerButton={
              <Button variant="secondary" className="mt-6 w-full md:w-[145px]" icon={<EyeRegular />} disabled={shouldDisablePreviewButton}>
                {tOperator('preview')}
              </Button>
            }
          />
          {/* Print signed button with dropdown */}
          <div className="mt-6 flex w-full md:w-auto">
            <Button
              variant="secondary"
              className="w-full rounded-r-none border-r-0 md:w-[145px]"
              icon={<Printer />}
              disabled={shouldDisablePrintButton}
              onClick={handlePrint}
            >
              {t('button.print')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-l-none px-2" disabled={shouldDisablePrintButton}>
                  <CaretDownRegular />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePrint}>{tOperator('printAction')}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>{tOperator('downloadAction')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Print unsigned button with dropdown */}
          <div className="mt-6 flex w-full md:w-auto">
            <Button
              variant="secondary"
              className="w-full rounded-r-none border-r-0 md:w-[145px]"
              icon={<Printer />}
              disabled={shouldDisablePrintUnsignedButton}
              onClick={handlePrintUnsigned}
            >
              {tOperator('printWithoutSign')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-l-none px-2" disabled={shouldDisablePrintUnsignedButton}>
                  <CaretDownRegular />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePrintUnsigned}>{tOperator('printAction')}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadUnsigned}>{tOperator('downloadAction')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Approval buttons (reject, approve, sign) - can be rendered separately below student data */}
      {showApprovalButtons && (
        <div className="flex flex-col-reverse flex-wrap gap-3 md:flex-row md:justify-end">
          <RejectDialog
            certificate={certificate}
            handleUpdateCertificate={handleUpdateCertificate}
            triggerButton={
              <Button
                variant="primary"
                className="w-full bg-red-500 hover:bg-red-600 active:border-red-700 active:bg-red-700 md:w-[145px]"
                icon={<X />}
                disabled={shouldDisableRejectButton}
              >
                {t('button.reject')}
              </Button>
            }
          />
          <Button
            onClick={handleApprove}
            disabled={shouldDisableApproveButton}
            loading={isApproving}
            variant="primary"
            className="w-full md:w-[145px]"
            icon={<Check />}
          >
            {t('button.approve')}
          </Button>
          <Button variant="primary" className="w-full md:w-[145px]" disabled={shouldDisableSignButton} loading={isSigning} onClick={handleSign}>
            <PencilRegular />
            {t('button.signed')}
          </Button>
        </div>
      )}
    </div>
  );
}
