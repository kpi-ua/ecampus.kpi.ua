import { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

export const DeputyDeanTableCard = ({ children }: Props) => (
  <Card className="mb-2 w-full rounded-[20px] bg-white p-5 shadow-lg sm:p-6">{children}</Card>
);
