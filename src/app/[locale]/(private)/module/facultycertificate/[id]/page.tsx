import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { getTranslations } from 'next-intl/server';
import { getCertificate, getCertificateData, getSignatories } from '@/actions/certificates.actions';
import { Description, Heading2, Heading3, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Warning } from '@/app/images';
import { TextDivider } from '@/components/ui/text-divider';
import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/certificates/components/certificate-status-badge';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import ActionButtons from '@/app/[locale]/(private)/module/facultycertificate/[id]/action-buttons';
import { CertificateStatus } from '@/types/models/certificate/status';
import { CertificateSignatory } from '@/types/models/certificate/signatory';
import { StudentDataSection } from './student-data-section';

interface Props {
  params: Promise<{ id: number }>;
}

export default async function DocInfoPage({ params }: Props) {
  const { id } = await params;
  const certificate = await getCertificate(id);
  const t = await getTranslations('private.facultycertificate');
  const tTable = await getTranslations('private.facultycertificate.table');

  // Fetch certificate data (from Dean DB) if available
  let studentData = null;
  try {
    studentData = await getCertificateData(id);
  } catch (e) {
    // Certificate data may not be available yet
  }

  // Fetch signatories for selection
  let signatories: CertificateSignatory[] = [];
  try {
    signatories = await getSignatories();
  } catch (e) {
    // Signatories may not be available
  }

  const tStudentData = await getTranslations('private.facultycertificate.studentData');

  const compoundObject = {
    documentNumber: certificate.documentNumber,
    status: <CertificateStatusBadge certificate={certificate} />,
    fullname: certificate.requestedBy.fullName,
    deliveryOption: certificate.originalRequired ? (
      <Badge variant="purple">{tTable('deliveryPaper')}</Badge>
    ) : (
      <Badge variant="blue">{tTable('deliveryElectronic')}</Badge>
    ),
    includeOrderInfo: !certificate.includeOrderInfo ? (
      <Badge variant="neutral">{tTable('orderInfoExcluded')}</Badge>
    ) : (
      <span className="text-neutral-500">{tTable('notRequired')}</span>
    ),
  };

  const canEditOperatorFields = certificate.status === CertificateStatus.Created && certificate.approved === null;

  return (
    <SubLayout pageTitle={certificate.documentNumber} breadcrumbs={[['/module/facultycertificate', t('title')]]}>
      <div className="col-span-7">
        <Heading2>{certificate.documentNumber || t('details.newRequest')}</Heading2>
        {/* Removed subtitle "Запит на отримання..." per KB-810 requirement */}
        <div className="flex flex-col gap-6">
          {/* Main Certificate Info Card */}
          <Card className="rounded-4 col-span-full w-full border border-neutral-200 bg-white p-6 shadow-none xl:col-span-5">
            {certificate.reason && (
              <Alert variant="destructive">
                <Warning width={20} height={20} />
                <AlertTitle>{t('alert.reason')}</AlertTitle>
                <AlertDescription>{certificate.reason}</AlertDescription>
              </Alert>
            )}
            <div className="mt-6 flex flex-col gap-6">
              {Object.entries(compoundObject).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                  <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                    {tTable(key)}:
                  </Paragraph>
                  <Paragraph className="m-0 font-medium">{value}</Paragraph>
                </div>
              ))}
            </div>

            {/* Student Purpose/Comment Section */}
            {certificate.purpose && (
              <>
                <TextDivider />
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
                  <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                    {tTable('purpose')}:
                  </Paragraph>
                  <Paragraph className="m-0 font-medium whitespace-pre-wrap">{certificate.purpose}</Paragraph>
                </div>
              </>
            )}

            {/* Student Notes Section */}
            {certificate.notes && (
              <>
                <TextDivider />
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
                  <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                    {tTable('notes')}:
                  </Paragraph>
                  <Paragraph className="m-0 font-medium whitespace-pre-wrap">{certificate.notes}</Paragraph>
                </div>
              </>
            )}

            <TextDivider />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">
                {tTable('created')}:
              </Paragraph>
              <Paragraph className="m-0 font-medium">
                {dayjs(certificate.created).format('DD.MM.YYYY, HH:mm')}
              </Paragraph>
            </div>

            <TextDivider />
            {/* Secondary action buttons only (refresh, regenerate, preview, print, sign) */}
            <ActionButtons
              certificate={certificate}
              signatories={signatories}
              canEditOperatorFields={canEditOperatorFields}
              variant="secondary-only"
            />
          </Card>

          {/* Student Certificate Data Card with approve/reject buttons below */}
          {studentData && (
            <Card className="rounded-4 col-span-full w-full border border-neutral-200 bg-white p-6 shadow-none xl:col-span-5">
              <Heading3 className="mb-2">{tStudentData('title')}</Heading3>
              <Description className="mb-4">{tStudentData('subtitle')}</Description>
              <StudentDataSection data={studentData} />

              {/* Approve/Reject buttons below student data per KB-810 requirement */}
              <div className="mt-6">
                <ActionButtons
                  certificate={certificate}
                  signatories={signatories}
                  canEditOperatorFields={canEditOperatorFields}
                  variant="approval-only"
                />
              </div>
            </Card>
          )}

          {/* Show approval buttons in main card if no student data available */}
          {!studentData && canEditOperatorFields && (
            <Card className="rounded-4 col-span-full w-full border border-neutral-200 bg-white p-6 shadow-none xl:col-span-5">
              <ActionButtons
                certificate={certificate}
                signatories={signatories}
                canEditOperatorFields={canEditOperatorFields}
                variant="approval-only"
              />
            </Card>
          )}
        </div>
      </div>
    </SubLayout>
  );
}
