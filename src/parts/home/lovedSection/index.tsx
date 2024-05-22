import CustomLink from '@/components/customLink';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export default function LovedSection() {
  const { t } = useTranslation('home');

  const cards = [
    {
      content: t('lovedSection.cards.nandula.content'),
      author: t('lovedSection.cards.nandula.author'),
      jobTitle: t('lovedSection.cards.nandula.title'),
      avatar: '/images/home/nandula.png',
      href: '',
    },
    {
      content: t('lovedSection.cards.bhargav.content'),
      author: t('lovedSection.cards.bhargav.author'),
      jobTitle: t('lovedSection.cards.bhargav.title'),
      avatar: '/images/home/bhargav.png',
      href: '',
    },
    {
      content: t('lovedSection.cards.igor.content'),
      author: t('lovedSection.cards.igor.author'),
      jobTitle: t('lovedSection.cards.igor.title'),
      avatar: '/images/home/igor.png',
      href: '',
    },
  ];

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <h2 className={classes.title}>{t('lovedSection.title')}</h2>

      <ul className={classes.cardList}>
        {cards.map(v => (
          <li className={classes.cardItem} key={v.author}>
            <CustomLink href={v.href}>
              <div className={classes.contentWrapper}>
                <p className={classes.cardContent}>{v.content}</p>
              </div>

              <div className={classes.authorWrapper}>
                <div className={classes.detailWrapper}>
                  <img src={v.avatar} alt={v.author} />
                  <div className="">
                    <p className={classes.author}>{v.author}</p>
                    <p className={classes.jobTitle}>{v.jobTitle}</p>
                  </div>
                </div>

                <img
                  src="/images/home/medium.png"
                  alt="Medium"
                  className={classes.mediumLogo}
                />
              </div>
            </CustomLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
