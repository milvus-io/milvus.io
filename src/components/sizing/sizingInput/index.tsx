import classes from './index.module.less';

import * as React from 'react';
import { cn } from '@/utils/merge';

interface SizingInputPropsType extends React.ComponentProps<'input'> {
  unit?: string;
  label?: React.ReactNode;
  customSize?: 'small' | 'medium';
  fullWidth?: boolean;
  classes?: {
    root?: string;
    input?: string;
    unit?: string;
    label?: string;
  };
}

const SizingInput = React.forwardRef<HTMLInputElement, SizingInputPropsType>(
  (
    {
      className,
      unit,
      label = '',
      customSize = 'medium',
      classes: customClasses,
      fullWidth = false,
      type,
      placeholder,
      ...props
    },
    ref
  ) => {
    const {
      root = '',
      input: inputClass = '',
      unit: unitClass = '',
      label: labelClass = '',
    } = customClasses || {};
    return (
      <div
        className={cn(
          classes.inputContainer,
          {
            [classes.fullWidth]: fullWidth,
          },
          root
        )}
      >
        {label && (
          <div className={cn(classes.inputLabel, labelClass)}>{label}</div>
        )}
        <div
          className={cn(classes.inputWrapper, {
            [classes.mediumSize]: customSize === 'medium',
            [classes.smallSize]: customSize === 'small',
            [classes.largePadding]: unit !== undefined,
          })}
        >
          <input
            type={type}
            className={cn(
              'flex h-10 border border-slate-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300  text-[12px] leading-[16px] font-[400] placeholder-[#9ca6b4]',
              inputClass,
              className
            )}
            ref={ref}
            placeholder={placeholder}
            {...props}
          />
          {unit && <span className={cn(classes.unit, unitClass)}>{unit}</span>}
        </div>
      </div>
    );
  }
);
SizingInput.displayName = 'SizingInput';

export { SizingInput };
