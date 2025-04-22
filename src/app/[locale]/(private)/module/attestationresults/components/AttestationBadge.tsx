import { Badge } from '@/components/ui/badge';

interface AttestationResultBadgeProps {
  result: boolean;
}

export function AttestationBadge({ result }: AttestationResultBadgeProps) {
  return (
    <Badge
      className={`flex justify-center border font-semibold ${
        result
          ? 'border-status-success-300 bg-status-success-100 text-status-success-300'
          : 'border-status-danger-300 bg-status-danger-100 text-status-danger-300'
      }`}
    >
      {result ? 'А' : 'Н/А'}
    </Badge>
  );
}
