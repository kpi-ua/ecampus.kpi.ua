import { getUserDetails } from '@/actions/auth.actions';
import { Heading1 } from '@/components/typography/headers';
import { cn } from '@/lib/utils';

interface GreetingProps {
  className?: string;
}

export default async function Greeting({ className }: GreetingProps) {
  const user = await getUserDetails();

  return <Heading1 className={cn(className)}>Вітаємо, {user?.fullName}!</Heading1>;
}
