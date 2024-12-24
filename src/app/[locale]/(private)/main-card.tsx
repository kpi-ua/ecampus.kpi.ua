import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MainCardProps {
  className?: string;
}

export const MainCard = ({ className }: MainCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex gap-8 space-y-1.5 p-10">
        <div className="m-0 grow basis-0">
          <Heading3>
            Ви увійшли до системи
            <br />
            <span className="text-brand-700">«Електронний Кампус»</span>
          </Heading3>
          <Paragraph>
            Тут можна знайти методичне забезпечення до навчальних дисциплін, результати поточного контролю, новини
            навчального процесу та іншу важливу інформацію.
          </Paragraph>
        </div>
        <div className="hidden grow basis-0 xl:block">
          <Image
            src="/images/Saly-10.png"
            quality={100}
            width={482}
            height={422}
            alt="saly"
            className="he-full w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
