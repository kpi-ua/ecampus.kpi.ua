import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { dash } from 'radash';
import { DetailRow } from '@/app/[locale]/(public)/validate-certificate/components/detail-row';
import { useTranslations } from 'next-intl';
import { CertificateVerificationResult } from '@/types/models/certificate/certificate-verification-result';
import { FC } from 'react';

interface Props {
  result: CertificateVerificationResult;
  t: ReturnType<typeof useTranslations<string>>;
}

export const CertificateDetails: FC<Props> = ({ result, t }) => {
  const tEnums = useTranslations('global.enums.certificate-type');

  return (
    <div className="w-full space-y-4">
      <div className="mb-4 flex items-center gap-3 rounded bg-green-50 px-4 py-3">
        <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-status-success-300" />
        <div className="font-medium text-status-success-300">{t('success')}</div>
      </div>

      <div className="space-y-6">
        <DetailRow label={t('owner')}>{result.requestedBy?.fullName}</DetailRow>

        <DetailRow label={t('date')}>{result.processed && dayjs(result.processed).format('DD.MM.YYYY')}</DetailRow>

        <DetailRow label={t('type')}>
          <Badge variant="blue" className="text-xs font-medium">
            {tEnums(dash(result.type))}
          </Badge>
        </DetailRow>

        <DetailRow label={t('purpose')}>{result.purpose}</DetailRow>
      </div>
    </div>
  );
};
