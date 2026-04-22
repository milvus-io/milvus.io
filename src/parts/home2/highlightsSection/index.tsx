import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import HighlightVisual from './HighlightVisual';

// Bento grid: Lake (headline capability) and Enterprise (the close)
// span two columns each; the middle four occupy one column. Mirrors the
// Zilliz Web 2026 "Built for Reliability" pattern (node 763-1233).
const HIGHLIGHTS = [
  { id: 'lake', span: 2 },
  { id: 'multivector', span: 1 },
  { id: 'hardware', span: 1 },
  { id: 'tiering', span: 1 },
  { id: 'streaming', span: 1 },
  { id: 'enterprise', span: 2 },
] as const;

export default function HighlightsSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>
            <span className={classes.titleLine}>
              {t('highlights.titleLine1')}
            </span>
            <span
              className={`${classes.titleLine} ${classes.titleLineAccent}`}
            >
              {t('highlights.titleLine2')}
            </span>
            <span className={classes.titleLine}>
              {t('highlights.titleLine3')}
            </span>
          </h2>
        </div>

        <div className={classes.grid}>
          {HIGHLIGHTS.map(({ id, span }) => (
            <article
              className={`${classes.card} ${
                span === 2 ? classes.cardWide : ''
              }`}
              key={id}
            >
              <div className={classes.cardCopy}>
                <span className={classes.cardTag}>
                  {t(`highlights.cards.${id}.tag`)}
                </span>
                <h3 className={classes.cardTitle}>
                  <Trans
                    t={t}
                    i18nKey={`highlights.cards.${id}.title`}
                    components={[<span key="a" className={classes.titleAccent} />]}
                  />
                </h3>
                <p className={classes.cardBody}>
                  {t(`highlights.cards.${id}.body`)}
                </p>
              </div>
              <div className={classes.cardVisual} aria-hidden>
                <HighlightVisual id={id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
