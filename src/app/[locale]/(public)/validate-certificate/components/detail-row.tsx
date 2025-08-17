import { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  label: string;
  children: ReactNode;
}
export const DetailRow: FC<Props> = ({ label, children, className = '' }) => (
  <div className={`flex flex-col gap-3 md:flex-row md:items-center md:gap-8 ${className}`}>
    <div className="min-w-[170px] text-lg font-semibold text-neutral-600">{label}</div>
    <div className="flex-1 text-lg text-neutral-900">{children}</div>
  </div>
);
