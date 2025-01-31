import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirectToOldCampus } from '@/actions/auth.actions';
import { Separator } from '@/components/ui/separator';

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
          <Link href="#">{t('notice-board')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">{t('faq')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">{t('user-manual')}</Link>
        </Paragraph>
        <Separator className="my-8" />
        <Paragraph>{t('old-campus.description')}</Paragraph>
        <form action={redirectToOldCampus}>
          <Button variant="primary" className="my-4" type="submit">
            {t('old-campus.link-title')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
