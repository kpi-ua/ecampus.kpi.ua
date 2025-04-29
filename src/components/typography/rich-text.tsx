import { ReactNode } from 'react';
import { Paragraph } from './paragraph';
import { Strong } from './strong';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from './headers';
import { UList } from './lists';

type Tag = 'p' | 'br' | 'b' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'ul' | 'li' | 'tel' | 'email';

interface Props {
  children(tags: Record<Tag, (chunks: ReactNode) => ReactNode>): ReactNode;
}

export default function RichText({ children }: Props) {
  return (
    <>
      {children({
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
      })}
    </>
  );
}
