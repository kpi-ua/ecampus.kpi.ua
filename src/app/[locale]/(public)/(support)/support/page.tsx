import { TextButton } from '@/components/ui/text-button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import CaretLeftRegular from '@/app/images/icons/CaretLeftRegular.svg';
import { SupportLayout } from '../support-layout';

export default function Support() {
  const t = useTranslations('public.support');

  return (
    <SupportLayout header={t('header')}>
      {t.rich('content', {
        tglink: (chunks) => <Link href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw">{chunks}</Link>,
        addresslink: (chunks) => <Link href="https://goo.gl/maps/ij4s8vuHPpLB92ZFA">{chunks}</Link>
      })}
    </SupportLayout>
  );
}
