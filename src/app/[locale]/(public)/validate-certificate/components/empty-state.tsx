import { GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface Props {
  t: ReturnType<typeof useTranslations<string>>;
}

export const EmptyState: FC<Props> = ({ t }) => (
  <div className="text-center text-muted-foreground">
    <GraduationCap className="mx-auto mb-3 h-12 w-12 text-neutral-400" />
    <div className="font-medium text-neutral-900">{t('empty')}</div>
    <div className="text-sm">{t('enter')}</div>
  </div>
);
