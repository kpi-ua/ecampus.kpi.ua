import Link from 'next/link';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('auth');

  return (
    <div className="text-sm">
      {t.rich('footer', {
        kbislink: (chunks) => <Link href="https://kbis.kpi.ua/" target="_blank">{chunks}</Link>,
        year: dayjs().year()
      })}
    </div>
  );
};
