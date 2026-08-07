import { StudentCertificateData } from '@/types/models/certificate/student-certificate-data';
import { Paragraph } from '@/components/typography';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';

interface Props {
  data: StudentCertificateData;
}

// Helper to format date without dots (e.g., "01 січня 2026")
function formatDate(day?: string, month?: string, year?: string): string | null {
  if (!day || !month || !year) return null;
  return `${day} ${month} ${year}`;
}

export async function StudentDataSection({ data }: Props) {
  const t = await getTranslations('private.facultycertificate.studentData');

  // Main student fields
  const mainFields = [
    { key: 'fullName', value: data.fullName },
    { key: 'group', value: data.group },
    { key: 'course', value: data.course },
    { key: 'educationLevel', value: data.educationLevel },
    { key: 'educationForm', value: data.educationForm },
    { key: 'financingSource', value: data.financingSource },
    { key: 'facultyTitleName', value: data.faculty?.titleName },
    {
      key: 'graduateDate',
      value: formatDate(data.graduateDay, data.graduateMonth, data.graduateYear)
    },
  ];

  // Order-related fields (separated by a line per KB-810)
  const orderFields = [
    { key: 'orderType', value: data.orderName },
    {
      key: 'orderDate',
      value: formatDate(data.orderDay, data.orderMonth, data.orderYear)
    },
  ];

  // Render a field row - always show even if empty (per KB-810 requirement)
  const renderField = (key: string, value: string | number | null | undefined) => (
    <div key={key} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
      <Paragraph className="m-0 w-[180px] shrink-0 font-semibold text-neutral-400">
        {t(key)}:
      </Paragraph>
      <Paragraph className="m-0 font-medium">
        {value !== null && value !== undefined && value !== '' ? value : '—'}
      </Paragraph>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main student info */}
      {mainFields.map(({ key, value }) => renderField(key, value))}

      {/* Separator before order fields */}
      <Separator className="my-2" />

      {/* Order-related fields */}
      {orderFields.map(({ key, value }) => renderField(key, value))}
    </div>
  );
}
