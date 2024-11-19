import { TextButton } from '@/components/ui/text-button';
import CaretLeftRegular from '@/app/images/icons/CaretLeftRegular.svg';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Heading2 } from '@/components/typography/headers';

interface SupportLayoutProps {
  children: React.ReactNode;
  header: string;
  description?: string;
  className?: string;
}

export const SupportLayout = ({ children, header, description, className }: SupportLayoutProps) => {
  const t = useTranslations('global.navigation');

  return (
    <>
      <TextButton
        variant="secondary"
        icon={<CaretLeftRegular />}
        className="mb-6"
        href="/"
      >
        {t('back')}
      </TextButton>
      <Heading2>{header}</Heading2>
      {description && <p className="py-4 text-neutral-600">{description}</p>}
      <section className={cn("mt-8 text-lg leading-normal", className)}>
        {children}
      </section>
    </>
  );
}