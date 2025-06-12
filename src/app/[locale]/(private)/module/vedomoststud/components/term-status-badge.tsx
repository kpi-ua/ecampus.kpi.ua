import { Badge } from '@/components/ui/badge';
import { getTranslations } from 'next-intl/server';
import { dash } from 'radash';
import { Status } from '@/types/enums/session/status';
import { cn } from '@/lib/utils';
import { getStatusStyle } from '@/app/[locale]/(private)/module/vedomoststud/components/utils';

interface TermStatusBadgeProps {
  status: Status;
  className?: string;
}

export async function TermStatusBadge({ status, className }: TermStatusBadgeProps) {
  const tEnums = await getTranslations('global.enums');
  const label = tEnums(`status.${dash(status)}`);
  const statusStyle = getStatusStyle(status);

  return <Badge className={cn(className, statusStyle)}>{label}</Badge>;
}
