'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  expanded: boolean;
  onToggle: () => void;
  label?: string;
  controls?: string;
}

export const TableExpandButton = ({ expanded, onToggle, label, controls }: Props) => (
  <button
    type="button"
    aria-expanded={expanded}
    aria-label={label}
    aria-controls={controls}
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
