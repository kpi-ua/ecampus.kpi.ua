'use client';

import React, { useState } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EyeRegular from '@/app/images/icons/EyeRegular.svg';
import EyeClosedRegular from '@/app/images/icons/EyeClosedRegular.svg';
import { cn } from '@/lib/utils';

const PasswordInput = ({ className, type, ref, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input {...props} type={showPassword ? 'text' : 'password'} className={cn('pr-12', className)} ref={ref} />
      <Button
        type="button"
        variant="tertiary"
        size="medium"
        className="absolute inset-y-[2px] right-[2px] flex items-center rounded-[6px] px-3 hover:bg-transparent hover:text-neutral-800"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? <EyeClosedRegular className="h-4 w-4" /> : <EyeRegular className="h-4 w-4" />}
      </Button>
    </div>
  );
};

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
