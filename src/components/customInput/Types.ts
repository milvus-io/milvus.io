import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  classes?: {
    root?: string;
    input?: string;
  };
  startIcon?: JSX.Element;
}
