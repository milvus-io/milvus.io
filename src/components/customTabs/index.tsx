import React, { useEffect, useState } from 'react';
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

  const [tabItemInfoList, setTabItemInfoList] = useState<
    { id: string; width: number }[]
  >([]);
  const [activeTabStyles, setActiveTabStyles] = useState({
    width: 0,
    translate: 0,
  });

  const handleTabChange = (id: string) => {
    if (id === activeTab) {
      return;
    }
    onTabChange(id);

    const index = tabItemInfoList.findIndex(v => v.id === id);
    const width = tabItemInfoList.find(v => v.id === id).width;

    console.log(tabItemInfoList.slice(0, index));
    const translate = tabItemInfoList
      .slice(0, index)
      .reduce((acc, cur) => (acc += cur.width), 0);

    setActiveTabStyles({
      width,
      translate,
    });
  };

  useEffect(() => {
    if (!window?.document) {
      return;
    }
    const liList = Array.from(document.querySelectorAll('.tab-item'));

    const widthList = liList.map((v: HTMLElement) => {
      const curEleWidth = v.offsetWidth;
      const curEleId = v.dataset.id;
      return {
        id: curEleId,
        width: curEleWidth,
      };
    });
    setTabItemInfoList(widthList);
    setActiveTabStyles({
      width: widthList[0].width,
      translate: 0,
    });
  }, []);

  return (
    <ul className={clsx(classes.tabsWrapper, root)}>
      {tabs.map(tab => (
        <li
          className={clsx(classes.tabItem, tabItem, 'tab-item', {
            [classes.active]: tab.id === activeTab,
          })}
          key={tab.id}
          data-id={tab.id}
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

      <span
        className={classes.activeBar}
        style={{
          width: `${activeTabStyles.width}px`,
          left: `${activeTabStyles.translate}px`,
        }}
      ></span>
    </ul>
  );
}
