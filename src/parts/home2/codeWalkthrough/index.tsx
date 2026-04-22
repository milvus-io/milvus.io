import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import CodeHighlight from '../components/CodeHighlight';
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

  const code = CODE_MAP[active];
  const note = t(`walkthrough.notes.${active}`);
  const panelId = `walkthrough-panel-${active}`;

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('walkthrough.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('walkthrough.sectionSubtitle')}</p>
        </div>

        <div className={classes.container}>
          <div
            className={classes.tabs}
            role="tablist"
            aria-label={t('walkthrough.sectionTitle')}
          >
            {TAB_ORDER.map(tabId => {
              const selected = active === tabId;
              return (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  id={`walkthrough-tab-${tabId}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(tabId)}
                  className={clsx(classes.tab, selected && classes.tabActive)}
                >
                  {t(`walkthrough.tabs.${tabId}`)}
                </button>
              );
            })}
          </div>

          <div className={classes.panelHeader}>
            <span className={classes.panelHeaderTitle}>
              milvus ▸ {t(`walkthrough.tabs.${active}`)}
            </span>
            <span className={classes.panelHeaderMeta}>
              {active === 'mcpServer' ? 'SHELL' : 'PYTHON'}
            </span>
          </div>

          <div className={classes.panelBody}>
            <div
              className={classes.codeBlock}
              role="tabpanel"
              id={panelId}
              aria-labelledby={`walkthrough-tab-${active}`}
            >
              <CodeHighlight
                code={code}
                language={active === 'mcpServer' ? 'bash' : 'python'}
              />
            </div>

            <aside className={classes.note} aria-live="polite">
              <span className={classes.noteLabel}>// note</span>
              {note}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
