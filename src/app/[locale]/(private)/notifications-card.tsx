import { Heading3 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirectToOldCampus } from '@/actions/auth.actions';

interface NotificationsCardProps {
  className?: string;
}

export const NotificationsCard = ({ className }: NotificationsCardProps) => {
  const t = useTranslations('global');
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <Heading3 className="mb-6">Повідомлення</Heading3>
        <Paragraph>
          <Badge className="uppercase">У розробці</Badge>
        </Paragraph>
      </CardHeader>
      <CardContent>
        <Heading3 className="mb-6">Iнформація</Heading3>
        <Paragraph className="my-1">
          <Link href="#">Розклад занять та сесії</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Дошка оголошень</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Поширенi запитання</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Інструкція користувача</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Про систему</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Документи КПІ ім. Ігоря Сікорського</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Контактнi данi</Link>
        </Paragraph>
        <Paragraph className="my-1">
          <Link href="#">Правила використання інформації сайту</Link>
        </Paragraph>
        <form action={redirectToOldCampus}>
          <Button variant="primary" className="my-5" type="submit">
            {t('goto-old')}
          </Button>
        </form>
        <Heading3 className="mb-6 mt-12">Аккаунт</Heading3>
        <Paragraph className="my-1">
          <Link href="#">Налаштування</Link>
        </Paragraph>
      </CardContent>
    </Card>
  );
};
