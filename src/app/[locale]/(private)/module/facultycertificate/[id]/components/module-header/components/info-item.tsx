import React from 'react';

interface Props {
  label: string;
  value: React.ReactNode;
}

export function InfoItem({ label, value }: Props) {
  return (
    <div className="flex flex-col-reverse text-left md:flex-col md:text-center">
      <span className="text-basic-black font-semibold">{value}</span>

      <span className="text-neutral-500">{label}</span>
    </div>
  );
}
