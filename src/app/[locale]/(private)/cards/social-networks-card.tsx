import { Facebook, GitHub, Instagram, TwitterX } from '@/app/images';
import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TextButton } from '@/components/ui/text-button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SocialNetworksCardProps {
  className?: string;
}

export const SocialNetworksCard = ({ className }: SocialNetworksCardProps) => {
  const t = useTranslations('private.main.cards.social-networks');
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-0">
        <Heading3>{t('title')}</Heading3>
      </CardHeader>
      <CardContent>
        <Paragraph>{t('description')}</Paragraph>
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
