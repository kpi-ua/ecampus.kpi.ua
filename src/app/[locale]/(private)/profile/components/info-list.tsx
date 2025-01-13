import { Paragraph } from '@/components/typography/paragraph';

export type InfoItem = {
  label: string;
  value?: number | string;
};

interface Props {
  items: InfoItem[];
}

export function InfoList({ items }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Paragraph className="m-0 w-[170px] shrink-0 font-semibold text-neutral-400">{item.label}:</Paragraph>
          <Paragraph className="m-0 font-medium">{item.value}</Paragraph>
        </div>
      ))}
    </div>
  );
}
