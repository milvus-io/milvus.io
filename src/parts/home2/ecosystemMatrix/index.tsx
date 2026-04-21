import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { CATEGORIES, CategoryId } from './const';

export default function EcosystemMatrix() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const [openMobile, setOpenMobile] = useState<Record<CategoryId, boolean>>({
    agent: true,
    model: false,
    rag: false,
    protocols: false,
    eval: false,
  });

  const toggle = (id: CategoryId) =>
    setOpenMobile(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('ecosystem.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('ecosystem.sectionSubtitle')}</p>
        </div>

        {CATEGORIES.map(({ id, logos }) => (
          <div
            key={id}
            className={classes.category}
            data-open={openMobile[id] ? 'true' : 'false'}
          >
            <h3>
              <button
                type="button"
                className={classes.categoryHeader}
                onClick={() => toggle(id)}
                aria-expanded={openMobile[id]}
                aria-controls={`ecosystem-logos-${id}`}
              >
                <span>{t(`ecosystem.categories.${id}`)}</span>
                <span className={classes.chevron} aria-hidden />
              </button>
            </h3>
            <div id={`ecosystem-logos-${id}`} className={classes.logoRow}>
              {logos.length === 0 ? (
                <span className={classes.emptyNote}>
                  {t('ecosystem.emptyGap')}
                </span>
              ) : (
                logos.map(logo => (
                  <a
                    key={logo.name}
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.logoLink}
                  >
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      className={classes.logoImg}
                      width={80}
                      height={40}
                      loading="lazy"
                    />
                  </a>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
