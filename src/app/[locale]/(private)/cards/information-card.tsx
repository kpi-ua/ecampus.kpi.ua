import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface InformationCardProps {
  className?: string;
}

export const InformationCard = ({ className }: InformationCardProps) => {
  const t = useTranslations('private.main.cards.information');

  return (
    <Card className={cn(className)}>
      <CardContent className="p-10">
        <Heading3 className="mb-6">{t('title')}</Heading3>
        <Paragraph className="my-1">
          <Link href="#">{t('schedule')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="/notice-board">{t('notice-board')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">{t('faq')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">{t('user-manual')}</Link>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
