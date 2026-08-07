import classes from './index.module.css';
import { BreadcrumbIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import clsx from 'clsx';

export default function Breadcrumb(props: {
  list: {
    label: string;
    href?: string;
    disabled?: boolean;
  }[];
  lang?: string;
  className?: string;
}) {
  const { list, className = '', lang = 'en' } = props;
  // Pin the language to the page's own locale: the server-side i18n instance is
  // always on `en`, so an unpinned `t` renders English on the server and the
  // page language on the client, which fails hydration.
  const { t } = useTranslation('home', { lng: lang });

  const length = list.length;

  const BreadcrumbItem = (props: {
    label: string;
    href?: string;
    disabled?: boolean;
    className?: string;
  }) => {
    const { label, href, disabled, className = '' } = props;
    const renderAsLink = href && !disabled;
    return (
      <>
        {renderAsLink ? (
          <Link href={href} className={clsx(classes.linkItem, className)}>
            {label}
          </Link>
        ) : (
          <p className={clsx(classes.textItem, className)}>{label}</p>
        )}
      </>
    );
  };

  const homeLink = lang == 'en' ? '/' : `/${lang}`;

  return (
    <ul className={clsx(classes.breadcrumbWrapper, className)}>
      <li className={classes.breadcrumbItem}>
        <Link href={homeLink} className={classes.linkItem}>
          {t('home')}
        </Link>
        <BreadcrumbIcon />
      </li>
      {list.map((v, i) => (
        <li className={classes.breadcrumbItem} key={v.label}>
          <BreadcrumbItem
            {...v}
            className={clsx({
              [classes.lastItem]: i === length - 1,
            })}
          />
          {i < length - 1 && <BreadcrumbIcon />}
        </li>
      ))}
    </ul>
  );
}
