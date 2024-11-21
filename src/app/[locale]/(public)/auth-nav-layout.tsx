import { TextButton } from '@/components/ui/text-button';
import CaretLeftRegular from '@/app/images/icons/CaretLeftRegular.svg';
import { useTranslations } from 'next-intl';
import { Heading2 } from '@/components/typography/headers';

export interface AuthNavLayoutProps {
  children: React.ReactNode;
  header: string;
  description?: string;
}

export const AuthNavLayout = ({ children, header, description }: AuthNavLayoutProps) => {
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
      {children}
    </>
  );
}