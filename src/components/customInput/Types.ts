import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClass?: string;
  fullWidth?: boolean;
}
