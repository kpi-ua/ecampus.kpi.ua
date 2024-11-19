import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from '@/components/typography/headers';

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    defaultTranslationValues: {
      p: (chunks) => <p className="my-5">{chunks}</p>,
      br: () => <br />,
      h1: (chunks) => <Heading1>{chunks}</Heading1>,
      h2: (chunks) => <Heading2>{chunks}</Heading2>,
      h3: (chunks) => <Heading3>{chunks}</Heading3>,
      h4: (chunks) => <Heading4>{chunks}</Heading4>,
      h5: (chunks) => <Heading5>{chunks}</Heading5>,
      h6: (chunks) => <Heading6>{chunks}</Heading6>,
      tel: (chunks) => <a className="whitespace-nowrap" href={`tel:${chunks}`}>{chunks}</a>,
      email: (chunks) => <a className="whitespace-nowrap" href={`mailto:${chunks}`}>{chunks}</a>,
    }
  };
});