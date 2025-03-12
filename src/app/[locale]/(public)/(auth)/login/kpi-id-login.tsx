import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { CoatOfArms } from '@/app/images';

export const KPIIDLogin = () => {
  const t = useTranslations('auth.login');

  return (
    <Button
      size="big"
      variant="secondary"
      className="my-4 w-full p-[11px] [&_svg]:size-[32px]"
      type="submit"
      icon={<CoatOfArms />}
      asChild
    >
      <Link href={process.env.NEXT_PUBLIC_KPI_AUTH_URL!}>{t('button.kpi-id')}</Link>
    </Button>
  );
};
