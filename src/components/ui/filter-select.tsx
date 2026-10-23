'use client';

import { useTranslations } from 'next-intl';
import { ComponentProps, ReactNode } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface Props
  extends
    Omit<ComponentProps<typeof Select>, 'children' | 'defaultValue' | 'value' | 'onValueChange'>,
    Pick<ComponentProps<typeof SelectTrigger>, 'id' | 'className' | 'variant'> {
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: readonly FilterSelectOption[];
  placeholder?: ReactNode;
}

/** Controlled filter select. Selecting 'All' emits null. */
export const FilterSelect = ({
  id,
  className,
  variant = 'small',
  options,
  value,
  onValueChange,
  placeholder,
  ...props
}: Props) => {
  const t = useTranslations('global');

  return (
    <Select
      value={value ?? 'all'}
      onValueChange={(selectedValue) => onValueChange(selectedValue === 'all' ? null : selectedValue)}
      {...props}
    >
      <SelectTrigger id={id} className={className} variant={variant}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all')}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
