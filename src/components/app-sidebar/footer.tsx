import React from 'react';
import { Paragraph } from '../typography/paragraph';
import { TextButton } from '../ui/text-button';
import { Link } from '@/i18n/routing';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

const createFooterLinks = (t: ReturnType<typeof useTranslations>) => [
  { title: t('user-manual'), url: '/user-manual' },
  { title: t('faq'), url: '/frequently-asked-questions' },
  { title: t('about'), url: '/about' },
  { title: t('documents'), url: '/kpi-documents' },
  { title: t('terms-of-service'), url: '/terms-of-service' },
  { title: t('contacts'), url: '/contacts' },
];

export const Footer = async () => {
  const t = useTranslations('global.menu');
  const footerT = useTranslations('global');
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
      {footerT.rich('footer', {
        kbislink: (chunks) => (
          <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
            {chunks}
          </Link>
        ),
        year: dayjs().year(),
        paragraph: (chunks) => <Paragraph className="mb-0 text-sm">{chunks}</Paragraph>,
      })}
    </section>
  );
};
