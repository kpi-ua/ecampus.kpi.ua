import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { dash } from 'radash';
import { Status } from '@/types/enums/session/status';
import { cn } from '@/lib/utils';
import { getStatusStyle } from '@/app/[locale]/(private)/module/vedomoststud/components/utils';

interface TermStatusBadgeProps {
  status: Status;
  className?: string;
}

export function TermStatusBadge({ status, className }: TermStatusBadgeProps) {
  const tEnums = useTranslations('global.enums');
  const label = tEnums(`status.${dash(status)}`);
  const statusStyle = getStatusStyle(status);

  return <Badge className={cn(className, statusStyle)}>{label}</Badge>;
}
