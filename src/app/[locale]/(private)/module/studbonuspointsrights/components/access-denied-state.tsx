import { Description, Heading2 } from '@/components/typography';
import { useTranslations } from 'next-intl';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

/**
 * Rendered when the JWT modules claim does not include the SBP rights module.
 * Wrapped in the same SubLayout as the main page so the breadcrumb stays
 * consistent regardless of access; the body is just heading + description.
 */
export function AccessDeniedState() {
  const t = useTranslations('private.studbonuspointsrights.accessDenied');
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 flex flex-col items-center gap-2 py-12 text-center">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
      </div>
    </SubLayout>
  );
}
