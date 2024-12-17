import { Facebook, GitHub, Instagram, TwitterX } from '@/app/images';
import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TextButton } from '@/components/ui/text-button';
import { cn } from '@/lib/utils';
import { Github } from 'lucide-react';

interface SocialNetworksCardProps {
  className?: string;
}

export const SocialNetworksCard = ({ className }: SocialNetworksCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-0">
        <Heading3>Соціальні мережі</Heading3>
      </CardHeader>
      <CardContent>
        <Paragraph>
          Ви завжди можете знайти найактуальнішу інформацію щодо роботи системи &quot;Електронний кампус КПІ&quot;, а
          також інших сервісів на нашій сторінці в Facebook, та також у нашому Телеграм-каналі:
        </Paragraph>
        <Paragraph className="mb-0 mt-8 flex flex-wrap gap-8">
          <TextButton
            size="huge"
            href={process.env.NEXT_PUBLIC_FACEBOOK_URL!}
            target="_blank"
            rel="noopener noreferrer"
            icon={<Facebook />}
          >
            Facebook
          </TextButton>
          <TextButton
            size="huge"
            href={process.env.NEXT_PUBLIC_TWITTER_URL!}
            target="_blank"
            rel="noopener noreferrer"
            icon={<TwitterX />}
          >
            Twitter
          </TextButton>
          <TextButton
            size="huge"
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL!}
            target="_blank"
            rel="noopener noreferrer"
            icon={<Instagram />}
          >
            Instagram
          </TextButton>
          <TextButton
            size="huge"
            href={process.env.NEXT_PUBLIC_GITHUB_URL!}
            target="_blank"
            rel="noopener noreferrer"
            icon={<GitHub />}
          >
            Github
          </TextButton>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
