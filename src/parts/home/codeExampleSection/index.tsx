import classes from './index.module.css';
import pageClasses from '@/styles/responsive.module.css';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CustomTabs from '@/components/customTabs';
import { useEffect, useMemo, useState } from 'react';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import {
  CODE_CREATE_COLLECTION,
  CODE_INSERT_DATA,
  CODE_SEARCH,
  CODE_DELETE_COLLECTION,
} from './const';

export default function CodeExampleSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  const tabs = [
    {
      label: t('codeSection.tabs.createCollection'),
      id: 'createCollection',
      code: CODE_CREATE_COLLECTION,
    },
    {
      label: t('codeSection.tabs.insertData'),
      id: 'insertData',
      code: CODE_INSERT_DATA,
    },
    {
      label: t('codeSection.tabs.search'),
      id: 'search',
      code: CODE_SEARCH,
    },
    {
      label: t('codeSection.tabs.delete'),
      id: 'delete',
      code: CODE_DELETE_COLLECTION,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const code = useMemo(() => {
    return tabs.find(tab => tab.id === activeTab)?.code || '';
  }, [activeTab]);

  const CodeBlock: React.FC<{ code: string; codeList: string[] }> = ({
    code,
    codeList,
  }) => {
    const [highlightedCode, setHighlightedCode] = useState(code);

    useEffect(() => {
      let cancelled = false;
      Promise.all([
        import('highlight.js/lib/core'),
        import('highlight.js/lib/languages/javascript'),
      ]).then(([{ default: hljs }, { default: javascript }]) => {
        require('highlight.js/styles/atom-one-dark.css');
        if (cancelled) return;
        hljs.registerLanguage('javascript', javascript);
        setHighlightedCode(
          hljs.highlight(code, { language: 'javascript' }).value
        );
      });
      return () => {
        cancelled = true;
      };
    }, [code]);

    useCopyCode(codeList);

    return (
      <div className={classes.codeBlock}>
        <pre className={classes.codePre}>
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
        </pre>
        <button className={clsx(classes.copyButton, 'copy-code-btn')}></button>
      </div>
    );
  };

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.codeExampleSection)}
    >
      <div className={classes.contentContainer}>
        <h2>{t('codeSection.title')}</h2>
        <div className={classes.codeContainer}>
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            classes={{
              root: classes.customTabsWrapper,
            }}
          />
          <CodeBlock code={code} codeList={tabs.map(v => v.code)} />
        </div>
      </div>
    </section>
  );
}
