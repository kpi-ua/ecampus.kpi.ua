import { Description, Heading3 } from '@/components/typography';
import { useTranslations } from 'next-intl';

interface Props {
  hasFilters: boolean;
}

/**
 * Shown when the rights list is empty. Differentiates between "no rights yet"
 * (initial state) and "no rights match these filters" so the SuperAdmin
 * doesn't reach for the Grant button only to realise filters are hiding rows.
 */
export function RightsEmptyState({ hasFilters }: Props) {
  const t = useTranslations('private.studbonuspointsrights.empty');
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <Heading3>{hasFilters ? t('filtered.title') : t('initial.title')}</Heading3>
      <Description>{hasFilters ? t('filtered.subtitle') : t('initial.subtitle')}</Description>
    </div>
  );
}
