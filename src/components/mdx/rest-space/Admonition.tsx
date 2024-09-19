import React from 'react';
import clsx from 'clsx';

import classes from './Admonition.module.css';

type Props = {
  children: React.ReactNode;
  type: 'note' | 'tip' | 'info' | 'warning' | 'danger';
  icon: string;
  title: string;
};

export const Admonition: React.FC<Props> = props => {
  const { type = 'note', icon, title, children } = props;
  return (
    <div
      className={clsx(classes.admonition, 'my-[1rem] p-[1rem] rounded-lg shadow-sm', {
        [classes.note]: type === 'note',
        [classes.tip]: type === 'tip',
        [classes.info]: type === 'info',
        [classes.warning]: type === 'warning',
        [classes.danger]: type === 'danger',
      })}
    >
      <div className="flex items-center mb-[12px]">
        <div className="inline-block mr-[8px] align-middle">{icon}</div>
        <div className="font-[600]">{title}</div>
      </div>
      {children}
    </div>
  );
};
