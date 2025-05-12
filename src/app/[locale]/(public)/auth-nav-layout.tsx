import { TextButton } from '@/components/ui/text-button';
import CaretLeftRegular from '@/app/images/icons/CaretLeftRegular.svg';
import { Heading2 } from '@/components/typography/headers';
import { getTranslations } from 'next-intl/server';

export interface AuthNavLayoutProps {
  children: React.ReactNode;
  header: string;
  description?: string;
  className?: string;
}

export const AuthNavLayout = async ({ children, header, description, className }: AuthNavLayoutProps) => {
  const t = await getTranslations('global.navigation');

  return (
    <>
      <TextButton variant="secondary" icon={<CaretLeftRegular />} className="mb-6" href="/">
        {t('back')}
      </TextButton>
      <article className={className}>
        <Heading2>{header}</Heading2>
        {description && <p className="py-4 text-neutral-600">{description}</p>}
        {children}
      </article>
    </>
  );
};
