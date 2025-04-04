import { Heading1, Heading3 } from '@/components/typography/headers';
import { SubLayout } from '../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { TextButton } from '@/components/ui/text-button';
import { ChatsTeardrop, EnvelopeSimple } from '@/app/images';

const INTL_NAMESPACE = 'private.contacts';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function ContactsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const t = useTranslations(INTL_NAMESPACE);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        {t.rich('content', {
          h3: (chunks) => <Heading3 className="mt-14">{chunks}</Heading3>,
          addresslink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_ADDRESS_URL!} target="_blank" rel="noopener noreferrer">
              {chunks}
            </Link>
          ),
          githublink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_GITHUB_URL!} target="_blank" rel="noopener noreferrer">
              {chunks}
            </Link>
          ),
          facebooklink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_FACEBOOK_URL!} target="_blank" rel="noopener noreferrer">
              {chunks}
            </Link>
          ),
          twitterlink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_TWITTER_URL!} target="_blank" rel="noopener noreferrer">
              {chunks}
            </Link>
          ),
          instagramlink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_INSTAGRAM_URL!} target="_blank" rel="noopener noreferrer">
              {chunks}
            </Link>
          ),
          suggestionslink: (chunks) => (
            <TextButton size="huge" href="/contacts/suggestions" icon={<ChatsTeardrop />}>
              {chunks}
            </TextButton>
          ),
          emaillink: (chunks) => (
            <TextButton size="huge" href="mailto:ecampus@kpi.ua" icon={<EnvelopeSimple />}>
              {chunks}
            </TextButton>
          ),
        })}
      </div>
    </SubLayout>
  );
}
