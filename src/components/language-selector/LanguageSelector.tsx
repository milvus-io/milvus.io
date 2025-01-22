import { FC, useState } from 'react';
import clsx from 'clsx';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LanguageEnum } from '@/types/localization';

export const LanguageValues = Object.values(LanguageEnum);

const LanguageIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_1804_386)">
        <rect
          width="16"
          height="16"
          transform="translate(0 0.5)"
          fill="white"
        />
        <path
          d="M8 16C7.03659 16 6.12919 15.8159 5.27778 15.4478C4.42637 15.0796 3.68489 14.5793 3.05333 13.9467C2.42074 13.3156 1.92037 12.5741 1.55222 11.7222C1.18407 10.8708 1 9.96341 1 9C1 8.034 1.18407 7.12581 1.55222 6.27544C1.92089 5.42507 2.42126 4.68411 3.05333 4.05256C3.68437 3.421 4.42585 2.92115 5.27778 2.553C6.12919 2.18433 7.03659 2 8 2C8.966 2 9.87419 2.18407 10.7246 2.55222C11.5749 2.92089 12.3159 3.42126 12.9474 4.05333C13.579 4.68489 14.0789 5.42559 14.447 6.27544C14.8157 7.12581 15 8.034 15 9C15 9.96341 14.8159 10.8708 14.4478 11.7222C14.0796 12.5736 13.5793 13.3151 12.9467 13.9467C12.3151 14.5787 11.5744 15.0791 10.7246 15.4478C9.87419 15.8159 8.966 16 8 16ZM8 15.2284C8.4563 14.642 8.83274 14.0662 9.12933 13.501C9.42541 12.9358 9.66626 12.3032 9.85189 11.6032H6.14811C6.35345 12.3426 6.59922 12.9949 6.88544 13.5601C7.17167 14.1253 7.54319 14.6814 8 15.2284ZM7.00989 15.1118C6.64693 14.684 6.31559 14.1551 6.01589 13.5251C5.71619 12.8956 5.49322 12.2547 5.347 11.6024H2.36344C2.80937 12.57 3.44119 13.3633 4.25889 13.9824C5.07711 14.6016 5.99385 14.978 7.00911 15.1118M8.98933 15.1118C10.0046 14.978 10.9213 14.6016 11.7396 13.9824C12.5578 13.3633 13.1896 12.57 13.635 11.6024H10.653C10.456 12.2646 10.2079 12.9107 9.90867 13.5407C9.60896 14.1701 9.30252 14.6939 8.98933 15.1118ZM2.04611 10.8247H5.18444C5.12533 10.5058 5.08385 10.1949 5.06 9.89211C5.03511 9.5893 5.02267 9.29193 5.02267 9C5.02267 8.70807 5.03485 8.4107 5.05922 8.10789C5.08359 7.80507 5.12507 7.49396 5.18367 7.17456H2.04767C1.96315 7.44419 1.89704 7.73793 1.84933 8.05578C1.80163 8.37363 1.77778 8.68837 1.77778 9C1.77778 9.31215 1.80137 9.62689 1.84856 9.94422C1.89626 10.2621 1.96237 10.5556 2.04689 10.8247M5.963 10.8247H10.037C10.0961 10.5058 10.1376 10.1999 10.1614 9.90689C10.1863 9.61444 10.1988 9.31215 10.1988 9C10.1988 8.68785 10.1866 8.38556 10.1622 8.09311C10.1379 7.80015 10.0964 7.49422 10.0378 7.17533H5.96222C5.90363 7.49422 5.86215 7.80015 5.83778 8.09311C5.81341 8.38556 5.80122 8.68785 5.80122 9C5.80122 9.31215 5.81341 9.61444 5.83778 9.90689C5.86215 10.1999 5.90441 10.5058 5.963 10.8247ZM10.8156 10.8247H13.9531C14.0376 10.555 14.1037 10.2616 14.1514 9.94422C14.1991 9.62689 14.2227 9.31215 14.2222 9C14.2222 8.68785 14.1986 8.37311 14.1514 8.05578C14.1037 7.73793 14.0376 7.44444 13.9531 7.17533H10.8148C10.8739 7.49422 10.9154 7.80507 10.9392 8.10789C10.9641 8.4107 10.9766 8.70807 10.9766 9C10.9766 9.29193 10.9644 9.5893 10.94 9.89211C10.9156 10.1949 10.8741 10.506 10.8156 10.8254M10.6538 6.39756H13.6358C13.18 5.4103 12.5557 4.61696 11.7629 4.01756C10.9696 3.41815 10.0453 3.03704 8.99011 2.87422C9.35307 3.35126 9.67948 3.89726 9.96933 4.51222C10.2587 5.12667 10.4868 5.75511 10.6538 6.39756ZM6.14811 6.39756H9.85189C9.64655 5.66748 9.39326 5.00741 9.092 4.41733C8.79126 3.82674 8.42726 3.27815 8 2.77156C7.57326 3.27815 7.20926 3.82674 6.908 4.41733C6.60726 5.00741 6.35396 5.66748 6.14811 6.39756ZM2.36422 6.39756H5.34622C5.51319 5.75511 5.74133 5.12667 6.03067 4.51222C6.32052 3.89726 6.64693 3.351 7.00989 2.87344C5.94485 3.03678 5.01826 3.42048 4.23011 4.02456C3.44196 4.62915 2.81974 5.41989 2.36344 6.39678"
          fill="currentColor"
        />
        <path
          d="M7.00989 15.1118C6.64693 14.684 6.31559 14.1551 6.01589 13.5251C5.71619 12.8956 5.49322 12.2547 5.347 11.6024H2.36344C2.80937 12.57 3.44119 13.3633 4.25889 13.9824C5.07711 14.6016 5.99385 14.978 7.00911 15.1118M2.04611 10.8247H5.18444C5.12533 10.5058 5.08385 10.1949 5.06 9.89211C5.03511 9.5893 5.02267 9.29193 5.02267 9C5.02267 8.70807 5.03485 8.4107 5.05922 8.10789C5.08359 7.80507 5.12507 7.49396 5.18367 7.17456H2.04767C1.96315 7.44419 1.89704 7.73793 1.84933 8.05578C1.80163 8.37363 1.77778 8.68837 1.77778 9C1.77778 9.31215 1.80137 9.62689 1.84856 9.94422C1.89626 10.2621 1.96237 10.5556 2.04689 10.8247M10.8156 10.8247H13.9531C14.0376 10.555 14.1037 10.2616 14.1514 9.94422C14.1991 9.62689 14.2227 9.31215 14.2222 9C14.2222 8.68785 14.1986 8.37311 14.1514 8.05578C14.1037 7.73793 14.0376 7.44444 13.9531 7.17533H10.8148C10.8739 7.49422 10.9154 7.80507 10.9392 8.10789C10.9641 8.4107 10.9766 8.70807 10.9766 9C10.9766 9.29193 10.9644 9.5893 10.94 9.89211C10.9156 10.1949 10.8741 10.506 10.8156 10.8254M2.36422 6.39756H5.34622C5.51319 5.75511 5.74133 5.12667 6.03067 4.51222C6.32052 3.89726 6.64693 3.351 7.00989 2.87344C5.94485 3.03678 5.01826 3.42048 4.23011 4.02456C3.44196 4.62915 2.81974 5.41989 2.36344 6.39678M8 16C7.03659 16 6.12919 15.8159 5.27778 15.4478C4.42637 15.0796 3.68489 14.5793 3.05333 13.9467C2.42074 13.3156 1.92037 12.5741 1.55222 11.7222C1.18407 10.8708 1 9.96341 1 9C1 8.034 1.18407 7.12581 1.55222 6.27544C1.92089 5.42507 2.42126 4.68411 3.05333 4.05256C3.68437 3.421 4.42585 2.92115 5.27778 2.553C6.12919 2.18433 7.03659 2 8 2C8.966 2 9.87419 2.18407 10.7246 2.55222C11.5749 2.92089 12.3159 3.42126 12.9474 4.05333C13.579 4.68489 14.0789 5.42559 14.447 6.27544C14.8157 7.12581 15 8.034 15 9C15 9.96341 14.8159 10.8708 14.4478 11.7222C14.0796 12.5736 13.5793 13.3151 12.9467 13.9467C12.3151 14.5787 11.5744 15.0791 10.7246 15.4478C9.87419 15.8159 8.966 16 8 16ZM8 15.2284C8.4563 14.642 8.83274 14.0662 9.12933 13.501C9.42541 12.9358 9.66626 12.3032 9.85189 11.6032H6.14811C6.35344 12.3426 6.59922 12.9949 6.88544 13.5601C7.17167 14.1253 7.54319 14.6814 8 15.2284ZM8.98933 15.1118C10.0046 14.978 10.9213 14.6016 11.7396 13.9824C12.5578 13.3633 13.1896 12.57 13.635 11.6024H10.653C10.456 12.2646 10.2079 12.9107 9.90867 13.5407C9.60896 14.1701 9.30252 14.6939 8.98933 15.1118ZM5.963 10.8247H10.037C10.0961 10.5058 10.1376 10.1999 10.1614 9.90689C10.1863 9.61444 10.1988 9.31215 10.1988 9C10.1988 8.68785 10.1866 8.38556 10.1622 8.09311C10.1379 7.80015 10.0964 7.49422 10.0378 7.17533H5.96222C5.90363 7.49422 5.86215 7.80015 5.83778 8.09311C5.81341 8.38556 5.80122 8.68785 5.80122 9C5.80122 9.31215 5.81341 9.61444 5.83778 9.90689C5.86215 10.1999 5.90441 10.5058 5.963 10.8247ZM10.6538 6.39756H13.6358C13.18 5.4103 12.5557 4.61696 11.7629 4.01756C10.9696 3.41815 10.0453 3.03704 8.99011 2.87422C9.35307 3.35126 9.67948 3.89726 9.96933 4.51222C10.2587 5.12667 10.4868 5.75511 10.6538 6.39756ZM6.14811 6.39756H9.85189C9.64656 5.66748 9.39326 5.00741 9.092 4.41733C8.79126 3.82674 8.42726 3.27815 8 2.77156C7.57326 3.27815 7.20926 3.82674 6.908 4.41733C6.60726 5.00741 6.35396 5.66748 6.14811 6.39756Z"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_1804_386">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const ArrowDownIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <g clip-path="url(#clip0_3441_107)">
        <path
          d="M1.85228 5.0569L7 10.2046L12.1477 5.0569"
          stroke="#667176"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3441_107">
          <rect
            width="14"
            height="14"
            fill="white"
            transform="matrix(1 0 0 -1 0 14)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

type Props = {
  value?: LanguageEnum;
  className?: string;
  disabled?: boolean;
  disabledLanguages?: LanguageEnum[];
  hiddenSelectValue?: boolean;
  onChange?: (lang: LanguageEnum) => void;
};

export const LanguageSelector: FC<Props> = props => {
  const {
    value = LanguageEnum.ENGLISH,
    className = '',
    disabled,
    disabledLanguages = [],
    hiddenSelectValue,
    onChange,
  } = props;
  const [opened, setOpened] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpened(open);
  };

  if (disabled) {
    return null;
  }

  const options = [
    {
      label: 'English',
      value: LanguageEnum.ENGLISH,
      disabled: disabledLanguages.includes(LanguageEnum.ENGLISH),
    },
    {
      label: '简体中文',
      value: LanguageEnum.CHINESE,
      disabled: disabledLanguages.includes(LanguageEnum.CHINESE),
    },
    {
      label: '繁體中文',
      value: LanguageEnum.CHINESE_TW,
      disabled: disabledLanguages.includes(LanguageEnum.CHINESE_TW),
    },
    {
      label: '日本語で',
      value: LanguageEnum.JAPANESE,
      disabled: disabledLanguages.includes(LanguageEnum.JAPANESE),
    },
    {
      label: '한국어',
      value: LanguageEnum.KOREAN,
      disabled: disabledLanguages.includes(LanguageEnum.KOREAN),
    },
    {
      label: 'Français',
      value: LanguageEnum.FRANCE,
      disabled: disabledLanguages.includes(LanguageEnum.FRANCE),
    },
    {
      label: 'Deutsch',
      value: LanguageEnum.GERMAN,
      disabled: disabledLanguages.includes(LanguageEnum.GERMAN),
    },
    {
      label: 'Español',
      value: LanguageEnum.SPANISH,
      disabled: disabledLanguages.includes(LanguageEnum.SPANISH),
    },
    {
      label: 'Italiano',
      value: LanguageEnum.ITALIAN,
      disabled: disabledLanguages.includes(LanguageEnum.ITALIAN),
    },
    {
      label: 'Português',
      value: LanguageEnum.PORTUGUESE,
      disabled: disabledLanguages.includes(LanguageEnum.PORTUGUESE),
    },
    {
      label: 'Русский',
      value: LanguageEnum.RUSSIAN,
      disabled: disabledLanguages.includes(LanguageEnum.RUSSIAN),
    },
    {
      label: 'Indonesia',
      value: LanguageEnum.INDONESIAN,
      disabled: disabledLanguages.includes(LanguageEnum.INDONESIAN),
    },
    {
      label: 'العربية',
      value: LanguageEnum.ARABIC,
      disabled: disabledLanguages.includes(LanguageEnum.ARABIC),
    },
  ].filter(option => !option.disabled);

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={onChange}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          className={clsx(
            `border-0 pl-0 gap-[4px] justify-start font-[600] text-black1 hover:text-black2`,
            {
              'text-black2': opened,
            }
          )}
          endIcon={
            <ArrowDownIcon
              className={clsx('transition-all', {
                'transform rotate-180': opened,
              })}
            />
          }
          open={opened}
        >
          <LanguageIcon className="transition-all" />
          {!hiddenSelectValue && <SelectValue placeholder="Language" />}
        </SelectTrigger>
        <SelectContent className="z-[1000]">
          <SelectGroup>
            {options.map(option => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
