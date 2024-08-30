import { FC, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import i18n from 'i18next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export enum LanguageEnum {
  ENGLISH = 'en',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  FRANCE = 'fr',
  GERMAN = 'de',
  SPANISH = 'es',
  ITALIAN = 'it',
  PORTUGUESE = 'pt',
}

export const LanguageValues = Object.values(LanguageEnum);

const LanguageIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M9 18C7.76133 18 6.59467 17.7633 5.5 17.29C4.40533 16.8167 3.452 16.1733 2.64 15.36C1.82667 14.5487 1.18333 13.5953 0.71 12.5C0.236667 11.4053 0 10.2387 0 9C0 7.758 0.236667 6.59033 0.71 5.497C1.184 4.40367 1.82733 3.451 2.64 2.639C3.45133 1.827 4.40467 1.18433 5.5 0.711C6.59467 0.237 7.76133 0 9 0C10.242 0 11.4097 0.236667 12.503 0.71C13.5963 1.184 14.549 1.82733 15.361 2.64C16.173 3.452 16.8157 4.40433 17.289 5.497C17.763 6.59033 18 7.758 18 9C18 10.2387 17.7633 11.4053 17.29 12.5C16.8167 13.5947 16.1733 14.548 15.36 15.36C14.548 16.1727 13.5957 16.816 12.503 17.29C11.4097 17.7633 10.242 18 9 18ZM9 17.008C9.58667 16.254 10.0707 15.5137 10.452 14.787C10.8327 14.0603 11.1423 13.247 11.381 12.347H6.619C6.883 13.2977 7.199 14.1363 7.567 14.863C7.935 15.5897 8.41267 16.3047 9 17.008ZM7.727 16.858C7.26033 16.308 6.83433 15.628 6.449 14.818C6.06367 14.0087 5.777 13.1847 5.589 12.346H1.753C2.32633 13.59 3.13867 14.61 4.19 15.406C5.242 16.202 6.42067 16.686 7.726 16.858M10.272 16.858C11.5773 16.686 12.756 16.202 13.808 15.406C14.86 14.61 15.6723 13.59 16.245 12.346H12.411C12.1577 13.1973 11.8387 14.028 11.454 14.838C11.0687 15.6473 10.6747 16.3207 10.272 16.858ZM1.345 11.346H5.38C5.304 10.936 5.25067 10.5363 5.22 10.147C5.188 9.75767 5.172 9.37533 5.172 9C5.172 8.62467 5.18767 8.24233 5.219 7.853C5.25033 7.46367 5.30367 7.06367 5.379 6.653H1.347C1.23833 6.99967 1.15333 7.37733 1.092 7.786C1.03067 8.19467 1 8.59933 1 9C1 9.40133 1.03033 9.806 1.091 10.214C1.15233 10.6227 1.23733 11 1.346 11.346M6.381 11.346H11.619C11.695 10.936 11.7483 10.5427 11.779 10.166C11.811 9.79 11.827 9.40133 11.827 9C11.827 8.59867 11.8113 8.21 11.78 7.834C11.7487 7.45733 11.6953 7.064 11.62 6.654H6.38C6.30467 7.064 6.25133 7.45733 6.22 7.834C6.18867 8.21 6.173 8.59867 6.173 9C6.173 9.40133 6.18867 9.79 6.22 10.166C6.25133 10.5427 6.30567 10.936 6.381 11.346ZM12.62 11.346H16.654C16.7627 10.9993 16.8477 10.622 16.909 10.214C16.9703 9.806 17.0007 9.40133 17 9C17 8.59867 16.9697 8.194 16.909 7.786C16.8477 7.37733 16.7627 7 16.654 6.654H12.619C12.695 7.064 12.7483 7.46367 12.779 7.853C12.811 8.24233 12.827 8.62467 12.827 9C12.827 9.37533 12.8113 9.75767 12.78 10.147C12.7487 10.5363 12.6953 10.9363 12.62 11.347M12.412 5.654H16.246C15.66 4.38467 14.8573 3.36467 13.838 2.594C12.818 1.82333 11.6297 1.33333 10.273 1.124C10.7397 1.73733 11.1593 2.43933 11.532 3.23C11.904 4.02 12.1973 4.828 12.412 5.654ZM6.619 5.654H11.381C11.117 4.71533 10.7913 3.86667 10.404 3.108C10.0173 2.34867 9.54933 1.64333 9 0.992C8.45133 1.64333 7.98333 2.34867 7.596 3.108C7.20933 3.86667 6.88367 4.71533 6.619 5.654ZM1.754 5.654H5.588C5.80267 4.828 6.096 4.02 6.468 3.23C6.84067 2.43933 7.26033 1.737 7.727 1.123C6.35767 1.333 5.16633 1.82633 4.153 2.603C3.13967 3.38033 2.33967 4.397 1.753 5.653"
        fill="#667176"
      />
    </svg>
  );
};

type Props = {
  value?: LanguageEnum;
  className?: string;
  disabled?: boolean;
};

export const LanguageSelector: FC<Props> = props => {
  const router = useRouter();
  const pathname = usePathname();
  const { value = LanguageEnum.ENGLISH, className = '', disabled } = props;

  useLayoutEffect(() => {
    i18n.changeLanguage(value);
  }, [value]);

  const handleLanguageChange = (lang: LanguageEnum) => {
    i18n.changeLanguage(lang);
    if (value === LanguageEnum.ENGLISH) {
      const newPath = pathname.replace(`/docs`, `/docs/${lang}`);
      router.push(newPath);
      return;
    }
    if (lang === LanguageEnum.ENGLISH) {
      const newPath = pathname.replace(`/${value}`, '');
      router.push(newPath);
      return;
    }
    const newPath = pathname.replace(`/${value}`, `/${lang}`);
    router.push(newPath);
  };

  if (disabled) {
    return null;
  }

  return (
    <Select defaultValue={value} onValueChange={handleLanguageChange}>
      <SelectTrigger
        className={`w-[150px] border-0 pl-0 gap-[4px] justify-start text-black2 ${className}`}
      >
        <LanguageIcon />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={LanguageEnum.ENGLISH}>English</SelectItem>
          <SelectItem value={LanguageEnum.CHINESE}>简体中文</SelectItem>
          <SelectItem value={LanguageEnum.JAPANESE}>日本語で</SelectItem>
          <SelectItem value={LanguageEnum.KOREAN}>한국어</SelectItem>
          <SelectItem value={LanguageEnum.FRANCE}>Français</SelectItem>
          <SelectItem value={LanguageEnum.GERMAN}>Deutsch</SelectItem>
          <SelectItem value={LanguageEnum.SPANISH}>Español</SelectItem>
          <SelectItem value={LanguageEnum.ITALIAN}>Italiano</SelectItem>
          <SelectItem value={LanguageEnum.PORTUGUESE}>Português</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
