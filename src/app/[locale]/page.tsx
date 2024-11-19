import { logout } from '@/actions/auth.actions';
import { Heading1 } from '@/components/typography/headers';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <Heading1>Dashboard</Heading1>
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  );
}
