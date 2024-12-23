import clsx from 'clsx';
import classes from './index.module.less';

export default function ResultSection(props: { className: string }) {
  const { className } = props;
  return <section className={clsx(className)}>result</section>;
}
