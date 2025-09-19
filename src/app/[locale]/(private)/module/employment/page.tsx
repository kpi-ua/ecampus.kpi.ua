import { Description, Heading2 } from '@/components/typography';
import { SubLayout } from '../../sub-layout';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { redirectToEmploymentSystem } from '@/actions/auth.actions';
import { LocaleProps } from '@/types/locale-props';

const INTL_NAMESPACE = 'private.employment-system';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function EmploymentPage() {
  const t = await getTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <form action={redirectToEmploymentSystem}>
          <Button variant="primary" type="submit">
            {t('button.title')}
          </Button>
        </form>
      </div>
    </SubLayout>
  );
}
