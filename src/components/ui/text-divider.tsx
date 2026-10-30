import { PropsWithChildren } from 'react';

export const TextDivider = ({ children }: PropsWithChildren) => {
  if (!children) {
    return (
      <span className="my-4 flex w-full items-center text-center text-neutral-600 before:mr-2 before:h-px before:grow before:bg-neutral-divider before:content-[''] after:ml-2 after:h-px after:grow after:bg-neutral-divider after:content-['']" />
    );
  }
  return (
    <span className="my-4 flex w-full items-center text-center text-neutral-600 before:mr-2 before:h-px before:grow before:bg-neutral-divider before:content-[''] after:ml-2 after:h-px after:grow after:bg-neutral-divider after:content-['']">
      {children}
    </span>
  );
};
