import React from 'react';
import classes from './index.module.less';
import clsx from 'clsx';

export interface CustomTabsProps {
  tabs: {
    label: React.ReactNode;
    id: string;
    link?: string;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  classes?: {
    root?: string;
    tabItem?: string;
  };
}

export default function CustomTabs(props: CustomTabsProps) {
  const { tabs, activeTab, onTabChange, classes: customClasses = {} } = props;

  const { tabItem, root } = customClasses;

  const handleTabChange = (id: string) => {
    onTabChange(id);
  };

  return (
    <ul className={clsx(classes.tabsWrapper, root)}>
      {tabs.map(tab => (
        <li
          className={clsx(classes.tabItem, tabItem, {
            [classes.active]: tab.id === activeTab,
          })}
          key={tab.id}
        >
          {tab.link ? (
            <a href={tab.link} className={classes.itemText}>
              {tab.label}
            </a>
          ) : (
            <button
              className={classes.itemText}
              onClick={() => {
                handleTabChange(tab.id);
              }}
            >
              {tab.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
