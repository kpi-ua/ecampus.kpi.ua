import Link from 'next/link';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import RichText from '@/components/typography/rich-text';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  const t = useTranslations('auth');

  return (
    <div className={cn('text-sm', className)}>
      <RichText>
        {(tags) =>
          t.rich('footer', {
            ...tags,
            kbislink: (chunks) => (
              <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
                {chunks}
              </Link>
            ),
            year: dayjs().year(),
          })
        }
      </RichText>
    </div>
  );
};
