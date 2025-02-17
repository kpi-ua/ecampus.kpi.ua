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
          <Link href={process.env.NEXT_PUBLIC_SCHEDULE_URL!} target="_blank" rel="noopener noreferrer">{t('schedule')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_UNIVERSITY_NOTICE_BOARD_URL!} target="_blank" rel="noopener noreferrer">{t('university-notice-board')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_LIBRARY_DISCOVERY_URL!} target="_blank" rel="noopener noreferrer">{t('library-discovery')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_UNIVERSITY_NEWS!} target="_blank" rel="noopener noreferrer">{t('university-news')}</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href={process.env.NEXT_PUBLIC_STUDENT_COUNCIL!} target="_blank" rel="noopener noreferrer">{t('student-council')}</Link>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
