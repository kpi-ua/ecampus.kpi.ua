import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  t: ReturnType<typeof useTranslations<string>>;
}

export const LoadingState: FC<Props> = ({ t }) => (
  <div className="space-y-2 text-center">
    <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-900" />
    <div className="font-medium text-neutral-900">{t('checking')}</div>
    <div className="text-sm text-muted-foreground">{t('wait')}</div>
  </div>
);
