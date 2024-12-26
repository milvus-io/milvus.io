import classes from './index.module.less';
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/utils/merge';

const SizingSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, checked, onChange, ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue1 data-[state=unchecked]:bg-slate-200 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950 dark:data-[state=checked]:bg-slate-50 dark:data-[state=unchecked]:bg-blue1',
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-slate-950 flex justify-center items-center'
        )}
      >
        <span
          className={cn('flex justify-center items-center', {
            [classes.visible]: checked,
            [classes.invisible]: !checked,
          })}
        >
          <svg
            width="7"
            height="6"
            viewBox="0 0 7 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.62025 0.932941L6.62059 0.93266L6.6126 0.924387C6.4857 0.792971 6.2813 0.792653 6.15402 0.923433L2.65441 4.43836L0.948326 2.72037C0.821057 2.5895 0.616589 2.58979 0.489659 2.72123C0.365296 2.85002 0.365296 3.0532 0.489659 3.18199L0.489648 3.182L0.491128 3.18349L2.25479 4.95946C2.36226 5.07029 2.50867 5.12559 2.64459 5.12559C2.79218 5.12559 2.92824 5.06893 3.03432 4.95953L6.58914 1.38915C6.727 1.26115 6.72587 1.06055 6.62025 0.932941ZM2.71351 4.49788L2.71253 4.49689C2.71287 4.49723 2.71319 4.49756 2.7135 4.49789L2.71351 4.49788Z"
              fill="#00B3FF"
              stroke="#00B3FF"
              strokeWidth="0.3"
            />
          </svg>
        </span>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});
SizingSwitch.displayName = 'SizingSwitch';

export { SizingSwitch };
