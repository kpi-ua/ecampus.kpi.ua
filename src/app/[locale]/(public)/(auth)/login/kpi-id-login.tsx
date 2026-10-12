import { getTranslations } from 'next-intl/server';
import KPIIDLogo from '@/app/images/icons/KPIID.svg';
import { Button } from '@/components/ui/button';
import { KPIID_LOGIN_PATH } from '@/middleware/contants';

// A plain link instead of the KPI ID widget: the state has to be minted per login on the server,
// which the widget's static data-state attribute cannot do.
export const KPIIDLogin = async () => {
  const t = await getTranslations('auth.login.button');

  return (
    <Button size="big" className="w-full" icon={<KPIIDLogo />} asChild>
      <a href={KPIID_LOGIN_PATH}>{t('kpi-id')}</a>
    </Button>
  );
};
