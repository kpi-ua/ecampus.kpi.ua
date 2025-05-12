import { ChatsTeardrop, EnvelopeSimple } from '@/app/images';
import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TextButton } from '@/components/ui/text-button';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface SupportCardProps {
  className?: string;
}

export const SupportCard = async ({ className }: SupportCardProps) => {
  const t = await getTranslations('private.main.cards.support');

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-0">
        <Heading3>{t('title')}</Heading3>
      </CardHeader>
      <CardContent>
        <Paragraph>{t('description')}</Paragraph>
        <Paragraph className="mb-0 mt-8 flex flex-col items-start gap-4">
          <TextButton size="huge" href="/contacts/suggestions" icon={<ChatsTeardrop />}>
            {t('button.suggestions-form')}
          </TextButton>
          <TextButton size="huge" href="mailto:ecampus@kpi.ua" icon={<EnvelopeSimple />}>
            {t('button.email')}
          </TextButton>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
