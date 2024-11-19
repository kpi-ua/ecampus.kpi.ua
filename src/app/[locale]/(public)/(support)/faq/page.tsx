import { TextButton } from '@/components/ui/text-button';
import { useTranslations } from 'next-intl';
import CaretLeftRegular from '@/app/images/icons/CaretLeftRegular.svg';
import { SupportLayout } from '../support-layout';

export default function FAQ() {
  const t = useTranslations('public.faq');

  return (
    <SupportLayout header={t('header')}>
      {t.rich('content')}
    </SupportLayout>
  );
}
