import Link from 'next/link';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  const t = useTranslations('auth');

  return (
    <div className={cn('text-sm', className)}>
      {t.rich('footer', {
        kbislink: (chunks) => <Link href="https://kbis.kpi.ua/" target="_blank">{chunks}</Link>,
        year: dayjs().year()
      })}
    </div>
  );
};
