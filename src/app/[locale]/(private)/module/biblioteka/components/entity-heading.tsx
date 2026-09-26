import { Description, Heading3 } from '@/components/typography';

interface Props {
  title: string;
  badge?: string;
  description: string;
}

export const EntityHeading = ({ title, badge, description }: Props) => (
  <header className="flex flex-col gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <Heading3 className="leading-xl text-2xl break-words lg:leading-xl lg:text-2xl">{title}</Heading3>
          {badge && (
            <span className="border-neutral-divider rounded-md border bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
    <Description className="p-0 text-sm leading-6">{description}</Description>
  </header>
);
