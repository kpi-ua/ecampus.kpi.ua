import { Link } from '@/i18n/routing';
import { CONTACT_TYPE_IDS, PHONE_TYPE_IDS, WEB_TYPE_IDS } from '@/lib/constants/contact-types';

interface ContactLinkProps {
  typeId: number;
  value: string;
}

export function ContactLink({ typeId, value }: ContactLinkProps) {
  // Decode HTML entities using a map of common entities
  const decodeHtmlEntities = (text: string) => {
    const htmlEntities: Record<string, string> = {
      '&quot;': '"',
      '&#34;': '"',
      '&apos;': "'",
      '&#39;': "'",
      '&amp;': '&',
      '&#38;': '&',
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&nbsp;': ' ',
      '&#160;': ' ',
    };

    return text.replace(/&[#\w]+;/g, (entity) => htmlEntities[entity] || entity);
  };

  const decodedValue = decodeHtmlEntities(value);

  const removeProtocol = (url: string) => {
    return url.replace(/^https?:\/\//, '');
  };

  const isSafeUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      return safeProtocols.includes(parsedUrl.protocol);
    } catch {
      // If URL parsing fails, check if it starts with safe protocols
      return /^(https?|mailto|tel):/.test(url);
    }
  };

  // E-mail
  if (typeId === CONTACT_TYPE_IDS.EMAIL) {
    return (
      <Link href={`mailto:${decodedValue}`} className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Phone types
  if (PHONE_TYPE_IDS.includes(typeId as (typeof PHONE_TYPE_IDS)[number])) {
    return (
      <Link href={`tel:${decodedValue}`} className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Web
  if (
    WEB_TYPE_IDS.includes(typeId as (typeof WEB_TYPE_IDS)[number]) ||
    decodedValue.startsWith('http://') ||
    decodedValue.startsWith('https://')
  ) {
    if (!isSafeUrl(decodedValue)) {
      return <span className="break-all">{removeProtocol(decodedValue)}</span>;
    }
    return (
      <Link href={decodedValue} target="_blank" rel="noopener noreferrer" className="break-all">
        {removeProtocol(decodedValue)}
      </Link>
    );
  }

  // Telegram
  if (typeId === CONTACT_TYPE_IDS.TELEGRAM) {
    const telegramUrl = decodedValue.startsWith('http')
      ? decodedValue
      : `https://t.me/${decodedValue.replace('@', '')}`;
    if (!isSafeUrl(telegramUrl)) {
      return <span className="break-all">{decodedValue}</span>;
    }
    return (
      <Link href={telegramUrl} target="_blank" rel="noopener noreferrer" className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Orcid ID
  if (typeId === CONTACT_TYPE_IDS.ORCID_ID) {
    const orcidUrl = decodedValue.startsWith('http') ? decodedValue : `https://orcid.org/${decodedValue}`;
    if (!isSafeUrl(orcidUrl)) {
      return <span className="break-all">{decodedValue}</span>;
    }
    return (
      <Link href={orcidUrl} target="_blank" rel="noopener noreferrer" className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Scopus ID
  if (typeId === CONTACT_TYPE_IDS.SCOPUS_ID) {
    const scopusUrl = decodedValue.startsWith('http')
      ? decodedValue
      : `https://www.scopus.com/authid/detail.uri?authorId=${decodedValue}`;
    if (!isSafeUrl(scopusUrl)) {
      return <span className="break-all">{decodedValue}</span>;
    }
    return (
      <Link href={scopusUrl} target="_blank" rel="noopener noreferrer" className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Research ID
  if (typeId === CONTACT_TYPE_IDS.RESEARCH_ID) {
    const researchIdUrl = decodedValue.startsWith('http')
      ? decodedValue
      : `https://www.webofscience.com/wos/author/record/${decodedValue}`;
    if (!isSafeUrl(researchIdUrl)) {
      return <span className="break-all">{decodedValue}</span>;
    }
    return (
      <Link href={researchIdUrl} target="_blank" rel="noopener noreferrer" className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Google Scholar
  if (typeId === CONTACT_TYPE_IDS.GOOGLE_SCHOLAR) {
    const scholarUrl = decodedValue.startsWith('http')
      ? decodedValue
      : `https://scholar.google.com/citations?user=${decodedValue}`;
    if (!isSafeUrl(scholarUrl)) {
      return <span className="break-all">{decodedValue}</span>;
    }
    return (
      <Link href={scholarUrl} target="_blank" rel="noopener noreferrer" className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Research Gate
  if (typeId === CONTACT_TYPE_IDS.RESEARCH_GATE) {
    const researchGateUrl = decodedValue.startsWith('http')
      ? decodedValue
      : `https://www.researchgate.net/profile/${decodedValue}`;
    if (!isSafeUrl(researchGateUrl)) {
      return <span className="break-all">{decodedValue}</span>;
    }
    return (
      <Link href={researchGateUrl} target="_blank" rel="noopener noreferrer" className="break-all">
        {decodedValue}
      </Link>
    );
  }

  // Social Network, Viber, Address, Fax, and others - display as plain text
  return <span className="break-all">{decodedValue}</span>;
}
