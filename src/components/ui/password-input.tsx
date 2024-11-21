'use client'

import React, { useState } from 'react';
import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EyeRegular from '@/app/images/icons/EyeRegular.svg';
import EyeClosedRegular from '@/app/images/icons/EyeClosedRegular.svg';
import { cn } from '@/lib/utils';

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    }

    return (
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          className={cn("pr-12", className)}
          ref={ref}
        />
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          className="absolute inset-y-[2px] right-[2px] flex items-center px-3 rounded-[6px] hover:bg-transparent hover:text-neutral-800"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeClosedRegular className="w-4 h-4" />
          ) : (
            <EyeRegular className="w-4 h-4" />
          )}
        </Button>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
