import { ChatsTeardrop, EnvelopeSimple } from '@/app/images';
import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TextButton } from '@/components/ui/text-button';
import { cn } from '@/lib/utils';

interface SupportCardProps {
  className?: string;
}

export const SupportCard = ({ className }: SupportCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-0">
        <Heading3>Служба пiдтримки</Heading3>
      </CardHeader>
      <CardContent>
        <Paragraph>Ви завжди можете звернутися в службу підтримки:</Paragraph>
        <Paragraph className="mb-0 mt-8 flex flex-col items-start gap-4">
          <TextButton size="huge" href="/contacts/complaints" icon={<ChatsTeardrop />}>
            Форма скарг i пропозицiй
          </TextButton>
          <TextButton size="huge" href="mailto:ecampus@kpi.ua" icon={<EnvelopeSimple />}>
            Email
          </TextButton>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
