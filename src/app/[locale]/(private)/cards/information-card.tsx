import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';

interface InformationCardProps {
  className?: string;
}

export const InformationCard = async ({ className }: InformationCardProps) => {
  const t = await getTranslations('private.main.cards.information');

  return (
    <Card className={cn(className)}>
      <CardContent className="p-10">
        <Heading3 className="mb-6">{t('title')}</Heading3>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_SCHEDULE_URL!} target="_blank" rel="noopener noreferrer">
            {t('schedule')}
          </Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_DNVR!} target="_blank" rel="noopener noreferrer">
            {t('dnvr')}
          </Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_UNIVERSITY_NOTICE_BOARD_URL!} target="_blank" rel="noopener noreferrer">
            {t('university-notice-board')}
          </Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_LIBRARY_DISCOVERY_URL!} target="_blank" rel="noopener noreferrer">
            {t('library-discovery')}
          </Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_UNIVERSITY_NEWS!} target="_blank" rel="noopener noreferrer">
            {t('university-news')}
          </Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_STUDENT_COUNCIL!} target="_blank" rel="noopener noreferrer">
            {t('student-council')}
          </Link>
        </Paragraph>
        <Separator className="my-4" />
        <Paragraph className="my-1">
          <Link href="/frequently-asked-questions">{t('faq')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="/user-manual">{t('user-manual')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="/student-manual">{t('student-manual')}</Link>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
