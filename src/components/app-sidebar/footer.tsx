import React from 'react';
import { Paragraph } from '../typography/paragraph';
import { TextButton } from '../ui/text-button';
import { Link } from '@/i18n/routing';
import dayjs from 'dayjs';
import RichText from '../typography/rich-text';
import { getTranslations } from 'next-intl/server';

const createFooterLinks = (t: Awaited<ReturnType<typeof getTranslations>>) => [
  { title: t('about'), url: '/about' },
  { title: t('documents'), url: '/kpi-documents' },
  { title: t('terms-of-service'), url: '/terms-of-service' },
  { title: t('contacts'), url: '/contacts' },
];

export const Footer = async () => {
  const t = await getTranslations('global.menu');
  const footerT = await getTranslations('global');
  const footerLinks = createFooterLinks(t);

  return (
    <section className="p-[calc(16px_+_0.5rem)] text-xs text-neutral-600">
      <Paragraph className="my-0 leading-base">
        {footerLinks.map((link) => (
          <React.Fragment key={link.url}>
            <TextButton href={link.url} variant="link" size="small">
              {link.title}
            </TextButton>{' '}
          </React.Fragment>
        ))}
      </Paragraph>
      <RichText>
        {(tags) =>
          footerT.rich('footer', {
            ...tags,
            kbislink: (chunks) => (
              <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
                {chunks}
              </Link>
            ),
            year: dayjs().year(),
            paragraph: (chunks) => <Paragraph className="mb-0 text-sm">{chunks}</Paragraph>,
          })
        }
      </RichText>
    </section>
  );
};
