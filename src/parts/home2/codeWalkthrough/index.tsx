import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import {
  CODE_ADD_MEMORY,
  CODE_SEMANTIC_RECALL,
  CODE_MULTI_TENANT,
  CODE_MCP_SERVER,
} from './const';

type TabId = 'addMemory' | 'semanticRecall' | 'multiTenant' | 'mcpServer';

const CODE_MAP: Record<TabId, string> = {
  addMemory: CODE_ADD_MEMORY,
  semanticRecall: CODE_SEMANTIC_RECALL,
  multiTenant: CODE_MULTI_TENANT,
  mcpServer: CODE_MCP_SERVER,
};

const TAB_ORDER: TabId[] = ['addMemory', 'semanticRecall', 'multiTenant', 'mcpServer'];

export default function CodeWalkthrough() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const [active, setActive] = useState<TabId>('addMemory');

  const code = useMemo(() => CODE_MAP[active], [active]);
  const note = useMemo(() => t(`walkthrough.notes.${active}`), [active, t]);

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('walkthrough.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('walkthrough.sectionSubtitle')}</p>
        </div>

        <div className={classes.container}>
          <div className={classes.tabs}>
            {TAB_ORDER.map(tabId => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActive(tabId)}
                className={clsx(classes.tab, active === tabId && classes.tabActive)}
              >
                {t(`walkthrough.tabs.${tabId}`)}
              </button>
            ))}
          </div>

          <pre className={classes.codeBlock}>
            <code>{code}</code>
          </pre>

          <aside className={classes.note}>{note}</aside>
        </div>
      </div>
    </section>
  );
}
