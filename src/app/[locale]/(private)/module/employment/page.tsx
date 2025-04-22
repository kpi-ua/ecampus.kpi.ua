import { Heading1 } from '@/components/typography/headers';
import { SubLayout } from '../../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Paragraph } from '@/components/typography/paragraph';
import { Button } from '@/components/ui/button';
import { redirectToEmploymentSystem } from '@/actions/auth.actions';

interface Props {
  params: Promise<{ locale: string }>;
}

const INTL_NAMESPACE = 'private.employment-system';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function EmploymentPage() {
  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <form action={redirectToEmploymentSystem}>
          <Button variant="primary" type="submit">
            {t('button.title')}
          </Button>
        </form>
      </div>
    </SubLayout>
  );
}
