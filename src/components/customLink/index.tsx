import Link from 'next/link';
import classes from './index.module.less';
import clsx from 'clsx';

type CustomLinkProps = {
  href: string;
  target?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary';
  endIcon?: React.ReactNode;
  disabled?: boolean;
  classes?: {
    root?: string;
    icon?: string;
  };
  [key: string]: any;
};

export default function CustomLink(props: CustomLinkProps) {
  const {
    href,
    target = '_self',
    children,
    variant = 'contained',
    color = 'primary',
    endIcon,
    disabled = false,
    classes: customClasses = {},
    ...rest
  } = props;
  const { root, icon } = customClasses;

  const isExternalLink = href.startsWith('http');

  return (
    <>
      {isExternalLink ? (
        <a
          {...rest}
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          className={clsx(classes.linkButton, root, {
            [classes.contained]: variant === 'contained',
            [classes.outlined]: variant === 'outlined',
            [classes.text]: variant === 'text',
            // [classes.primaryColor]: color === 'primary',
            // [classes.secondaryColor]: color === 'secondary',
            [classes.disabledLink]: disabled,
          })}
        >
          {children}
          {endIcon && (
            <span className={clsx(classes.iconWrapper, icon)}>{endIcon}</span>
          )}
        </a>
      ) : (
        <Link
          {...rest}
          href={href}
          target={target}
          className={clsx(classes.linkButton, root, {
            [classes.contained]: variant === 'contained',
            [classes.outlined]: variant === 'outlined',
            [classes.text]: variant === 'text',

            [classes.primaryColor]: color === 'primary',
            [classes.secondaryColor]: color === 'secondary',
            [classes.disabledLink]: disabled,
          })}
        >
          {children}
          {endIcon && (
            <span className={clsx(classes.iconWrapper, icon)}>{endIcon}</span>
          )}
        </Link>
      )}
    </>
  );
}
