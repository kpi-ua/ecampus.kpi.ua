import { Badge } from '@/components/ui/badge';
import { getTranslations } from 'next-intl/server';

interface AttestationResultBadgeProps {
  result: boolean;
}

export async function AttestationBadge({ result }: AttestationResultBadgeProps) {
  const t = await getTranslations('private.attestation-results');

  const status = result ? t('success-attestation') : t('fail-attestation');
  return (
    <Badge
      className={`flex justify-center border font-semibold ${
        result
          ? 'border-status-success-300 bg-status-success-100 text-status-success-300'
          : 'border-status-danger-300 bg-status-danger-100 text-status-danger-300'
      }`}
    >
      {status}
    </Badge>
  );
}
