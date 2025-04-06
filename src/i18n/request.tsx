import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from '@/components/typography/headers';
import { UList } from '@/components/typography/lists';
import { Paragraph } from '@/components/typography/paragraph';
import { Strong } from '@/components/typography/strong';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    defaultTranslationValues: {
      p: (chunks) => <Paragraph>{chunks}</Paragraph>,
      br: () => <br />,
      b: (chunks) => <Strong>{chunks}</Strong>,
      h1: (chunks) => <Heading1>{chunks}</Heading1>,
      h2: (chunks) => <Heading2>{chunks}</Heading2>,
      h3: (chunks) => <Heading3>{chunks}</Heading3>,
      h4: (chunks) => <Heading4>{chunks}</Heading4>,
      h5: (chunks) => <Heading5>{chunks}</Heading5>,
      h6: (chunks) => <Heading6>{chunks}</Heading6>,
      ul: (chunks) => <UList>{chunks}</UList>,
      li: (chunks) => <li>{chunks}</li>,
      tel: (chunks) => (
        <a className="whitespace-nowrap" href={`tel:${chunks}`}>
          {chunks}
        </a>
      ),
      email: (chunks) => (
        <a className="whitespace-nowrap" href={`mailto:${chunks}`}>
          {chunks}
        </a>
      ),
    },
  };
});
