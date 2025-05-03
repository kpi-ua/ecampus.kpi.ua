import { Heading5 } from '@/components/typography/headers';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { TextButton } from '@/components/ui/text-button';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface DocumentCardProps {
  BackgroundImage: React.ElementType;
  header: string;
  url: string;
  className?: string;
}

export const DocumentCard = async ({ BackgroundImage, header, url, className }: DocumentCardProps) => {
  const t = await getTranslations('global.misc');

  return (
    <Card className={cn('relative z-10 flex flex-col', className)}>
      <CardHeader>
        <Heading5>{header}</Heading5>
      </CardHeader>
      <CardContent className="h-24 grow">
        <BackgroundImage className="absolute bottom-0 right-0 z-20 rounded-br-lg opacity-50" />
      </CardContent>
      <CardFooter>
        <TextButton variant="primary" size="big" href={url} target="_blank" rel="noopener noreferrer">
          {t('view')}
        </TextButton>
      </CardFooter>
    </Card>
  );
};
