'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

export const TableExpandButton = ({ expanded, onToggle }: Props) => (
  <button
    type="button"
    className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
    onClick={onToggle}
  >
    {expanded ? (
      <ChevronUp aria-hidden="true" className="size-5" />
    ) : (
      <ChevronDown aria-hidden="true" className="size-5" />
    )}
  </button>
);
