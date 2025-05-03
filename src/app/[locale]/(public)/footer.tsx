import Link from 'next/link';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import RichText from '@/components/typography/rich-text';
import { getTranslations } from 'next-intl/server';

interface FooterProps {
  className?: string;
}

export const Footer = async ({ className }: FooterProps) => {
  const t = await getTranslations('auth');

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
