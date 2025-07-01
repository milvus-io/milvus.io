import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/commonLayout';
import styles from '../../styles/blog.module.less';
import pageClasses from '../../styles/responsive.module.less';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import {
  AirplaneArrowIcon,
  ClockIcon,
  RocketIcon,
  SearchIcon,
  TrendingIcon,
} from '../../components/icons';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { BlogFrontMatterType } from '@/types/blogs';
import SubscribeNewsletter from '@/components/subscribe';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';
import { InkeepCustomTriggerWrapper } from '@/components/inkeep/inkeepChat';
import ZillizAdv from '@/parts/blogs/zillizAdv';
import {
  ELLIPSIS,
  ELLIPSIS_2,
  PAGE_SIZE,
  TAG_QUERY_KEY,
  DEFAULT_TAG,
  PAGINATION_QUERY_KEY,
  SEARCH_QUERY_KEY,
} from '@/consts/blog';
import { LanguageEnum } from '@/types/localization';
import { generatePaginationNavigators } from '@/utils/format';

interface Props {
  locale: LanguageEnum;
  blogList: BlogFrontMatterType[];
}

interface BlogData {
  recommend: BlogFrontMatterType;
  all: BlogFrontMatterType[];
  topRecent: BlogFrontMatterType[];
  topRecentRelease: BlogFrontMatterType[];
}

enum BlogTag {
  // old
  events = 'events',
  news = 'news',
  scenarios = 'scenarios',
  // new
  engineering = 'engineering',
  announcements = 'announcements',
  tutorials = 'tutorials',
  useCases = 'usecases',
}

interface BlogFilter {
  [TAG_QUERY_KEY]?: BlogTag | typeof DEFAULT_TAG;
  [PAGINATION_QUERY_KEY]?: number;
  [SEARCH_QUERY_KEY]?: string;
}

interface BlogLinkParam {
  key: keyof BlogFilter;
  value: any;
  shouldRemove?: boolean;
}

const TOP_RECENT_COUNT = 3;

const convertToNewTag = (tag: string) => {
  const processedTag = tag.replace(/\s/g, '').toLowerCase() as BlogTag;
  // events & news => announcements
  // scenarios => useCases
  if ([BlogTag.events, BlogTag.news].includes(processedTag)) {
    return BlogTag.announcements;
  }
  if ([BlogTag.scenarios].includes(processedTag)) {
    return BlogTag.useCases;
  }
  return processedTag;
};

const includesTag = (blog: BlogFrontMatterType, tag: BlogTag) => {
  const { tags } = blog;
  return tags.map(t => convertToNewTag(t)).includes(tag);
};

const getBlogLink = (blog: BlogFrontMatterType, locale: LanguageEnum) => {
  const prefix = locale === LanguageEnum.ENGLISH ? '/blog' : `/${locale}/blog`;
  return `${prefix}/${blog.id}`;
};

export const BlogHome: React.FC<Props> = props => {
  const { locale } = props;
  const absoluteUrl =
    locale === LanguageEnum.ENGLISH
      ? `${ABSOLUTE_BASE_URL}/blog`
      : `${ABSOLUTE_BASE_URL}/${locale}/blog`;

  const router = useRouter();
  const query: BlogFilter = router.query;

  const { t } = useTranslation(['blog', 'footer'], { lng: props.locale });
  const [filter, setFilter] = useState<BlogFilter>(query);

  useEffect(() => {
    setFilter(query);
  }, [query]);

  const blogs = useMemo(() => {
    const defaultData: BlogData = {
      recommend: props.blogList[0],
      all: props.blogList,
      topRecent: [],
      topRecentRelease: [],
    };
    const data = props.blogList.reduce((acc, cur) => {
      const shouldSetRecommend =
        cur.recommend &&
        (!acc.recommend?.recommend ||
          new Date(acc.recommend.date) < new Date(cur.date));

      if (shouldSetRecommend) {
        acc.recommend = cur;
        // acc.all = props.blogList.filter(v => v.id !== cur.id);
      }
      return acc;
    }, defaultData);

    const sortedByDate = [...data.all].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedByDate.forEach(b => {
      if (
        data.topRecent.length < TOP_RECENT_COUNT &&
        !includesTag(b, BlogTag.announcements)
      ) {
        data.topRecent.push(b);
      }
      if (
        data.topRecentRelease.length < TOP_RECENT_COUNT &&
        includesTag(b, BlogTag.announcements)
      ) {
        data.topRecentRelease.push(b);
      }
    });

    return data;
  }, [props.blogList]);

  const filteredBlogs = useMemo(() => {
    return blogs.all.filter((b, i) => {
      const { author = '', title = '' } = b;
      const isMatchTag =
        !filter[TAG_QUERY_KEY] ||
        filter[TAG_QUERY_KEY] === DEFAULT_TAG ||
        includesTag(b, filter[TAG_QUERY_KEY]);

      const isMatchSearch =
        !filter[SEARCH_QUERY_KEY] ||
        title
          .toLowerCase()
          .includes(filter[SEARCH_QUERY_KEY].trim().toLowerCase()) ||
        author
          .toLowerCase()
          .includes(filter[SEARCH_QUERY_KEY].trim().toLowerCase());

      return isMatchTag && isMatchSearch;
    });
  }, [filter, blogs]);

  const paging = useMemo(() => {
    const page = filter[PAGINATION_QUERY_KEY] || 1;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pages = Math.ceil(filteredBlogs.length / PAGE_SIZE);
    return {
      total: filteredBlogs.length,
      pages,
      list: filteredBlogs.slice(start, end),
      navigators: generatePaginationNavigators(Number(page), pages),
    };
  }, [filteredBlogs]);

  const generateLinkUrl = (...args: BlogLinkParam[]) => {
    const { [SEARCH_QUERY_KEY]: _, ...queryObject } = filter;
    const search = new URLSearchParams(queryObject as any);
    args.forEach(({ key, value, shouldRemove }) => {
      if (shouldRemove) {
        search.delete(key);
      } else {
        search.set(key, value);
      }
    });
    if (!search.size) {
      return router.pathname;
    }
    return `${router.pathname}?${search.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    const url = generateLinkUrl(
      // { key: SEARCH_QUERY_KEY, value, shouldRemove: !value },
      { key: PAGINATION_QUERY_KEY, value: 1, shouldRemove: true }
    );
    window.history.pushState({}, '', url);
    setFilter(f => ({
      ...f,
      [SEARCH_QUERY_KEY]: value,
      [PAGINATION_QUERY_KEY]: 1,
    }));
  };

  const handleFilter = (tag: BlogTag | 'all') => (e: React.MouseEvent) => {
    // reduce list fetch when router change
    e.preventDefault();
    const url = generateLinkUrl(
      { key: TAG_QUERY_KEY, value: tag, shouldRemove: tag === DEFAULT_TAG },
      { key: PAGINATION_QUERY_KEY, value: 1, shouldRemove: true }
    );
    window.history.pushState({}, '', url);
    setFilter(f => ({ ...f, [TAG_QUERY_KEY]: tag, [PAGINATION_QUERY_KEY]: 1 }));
  };

  const handlePaging = (page: number) => (e: React.MouseEvent) => {
    // reduce list fetch when router change
    e.preventDefault();
    const url = generateLinkUrl({
      key: PAGINATION_QUERY_KEY,
      value: page,
      shouldRemove: page === 1,
    });
    window.history.pushState({}, '', url);
    setFilter(f => ({ ...f, [PAGINATION_QUERY_KEY]: page }));
    scrollToListNav();
  };

  const renderRecommend = () => {
    const { recommend } = blogs;
    return (
      <section className={styles['recommend']}>
        <span className={styles['trending']}>
          <TrendingIcon />
          {t('blog:trending')}
        </span>
        <Link href={getBlogLink(recommend, locale as LanguageEnum)}>
          <h1 className={styles['recommend-title']}>{recommend.title}</h1>
        </Link>
        <p className={styles['recommend-desc']}>{recommend.desc}</p>
        <div className={styles['recommend-extra']}>
          <BlogExtra data={recommend} dark={true} />
        </div>
      </section>
    );
  };

  const renderRecentBlogs = (list: BlogFrontMatterType[]) => {
    return list.map((b, i) => (
      <React.Fragment key={b.id}>
        <div key={b.id} className={styles['recent-blog']}>
          <Link href={getBlogLink(b, locale as LanguageEnum)}>
            <h2 className={styles['recent-blog-title']}>{b.title}</h2>
          </Link>
          <BlogExtra data={b} />
        </div>
        {i < list.length - 1 && (
          <hr key={i} className={styles['recent-blog-separator']} />
        )}
      </React.Fragment>
    ));
  };

  const renderRecentTabs = () => {
    const tabs = [
      {
        title: t('blog:recent.most'),
        icon: <ClockIcon />,
        key: 'recent',
        renderContent: () => renderRecentBlogs(blogs.topRecent),
      },
      {
        title: t('blog:recent.release'),
        icon: <RocketIcon />,
        key: 'release',
        renderContent: () => renderRecentBlogs(blogs.topRecentRelease),
      },
    ];

    return (
      <div className={styles['recent']}>
        <Tabs tabs={tabs} />
      </div>
    );
  };

  const renderSubscribe = () => {
    return (
      <div className={styles['subscribe']}>
        <div className={styles['subscribe-info']}>
          <h2 className={styles['subscribe-title']}>
            <Trans
              t={t}
              i18nKey="blog:subscribe.title"
              components={[<strong />]}
            />
          </h2>
          <p className={styles['subscribe-desc']}>{t('blog:subscribe.desc')}</p>
        </div>
        <div className={styles['subscribe-form']}>
          <SubscribeNewsletter
            withoutTitle={true}
            classes={{
              button: styles['subscribe-button'],
              inputContainer: styles['subscribe-input-container'],
              input: styles['subscribe-input'],
              errorMessage: styles['subscribe-input-message'],
            }}
          />
        </div>
      </div>
    );
  };

  const renderFilterTagItem = (tag: BlogTag | typeof DEFAULT_TAG) => {
    const isActive = tag === (filter[TAG_QUERY_KEY] || DEFAULT_TAG);
    const url = generateLinkUrl(
      {
        key: TAG_QUERY_KEY,
        value: tag,
        shouldRemove: tag === DEFAULT_TAG,
      },
      { key: PAGINATION_QUERY_KEY, value: 1, shouldRemove: true }
    );
    return (
      <Link key={tag} href={url} onClick={handleFilter(tag)} scroll={false}>
        <div
          className={clsx(styles['filter-tag'], isActive && styles['active'])}
          key={tag}
        >
          {t(`blog:filter.${tag}`)}
        </div>
      </Link>
    );
  };

  const renderFilter = () => {
    const filterTags = [
      DEFAULT_TAG,
      BlogTag.engineering,
      BlogTag.announcements,
      BlogTag.tutorials,
      BlogTag.useCases,
    ] as const;
    const filterTagItems = filterTags.map(f => renderFilterTagItem(f));

    return (
      <div className={styles['filter']}>
        <div className={styles['filter-tags']}>{filterTagItems}</div>
      </div>
    );
  };

  const renderSearcher = () => {
    return (
      <label className={styles['searcher']}>
        <SearchIcon className={styles['searcher-icon']} />
        <input
          className={styles['searcher-input']}
          placeholder="Search"
          defaultValue={filter[SEARCH_QUERY_KEY]}
          onInput={handleSearch}
        />
      </label>
    );
  };

  const renderBlogList = () => {
    return paging.list.map(b => (
      <BlogCard key={b.id} data={b} locale={locale} />
    ));
  };

  const scrollToListNav = () => {
    const listEl = document.querySelector(`.${styles['content']}`);
    listEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderPaging = () => {
    const { navigators, pages } = paging;
    const currentPage = Number(filter[PAGINATION_QUERY_KEY] || 1);

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < pages;

    return (
      <Pagination className={styles.paginationWrapper}>
        <PaginationContent style={{ gap: 5 }}>
          <PaginationItem>
            <PaginationPrevious
              scroll={false}
              onClick={handlePaging(currentPage - 1)}
              href={generateLinkUrl({
                key: PAGINATION_QUERY_KEY,
                value: currentPage - 1,
                shouldRemove: currentPage === 2,
              })}
              disabled={!hasPrev}
              className={clsx(styles.paginationLink, {
                [styles.disabledNavigationLink]: !hasPrev,
              })}
            />
          </PaginationItem>
          {navigators.map((v, i) => {
            return (
              <PaginationItem key={v}>
                {String(v).includes(ELLIPSIS) ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    scroll={false}
                    onClick={handlePaging(v as number)}
                    href={generateLinkUrl({
                      key: PAGINATION_QUERY_KEY,
                      value: v,
                      shouldRemove: v === 1,
                    })}
                    isActive={currentPage === v}
                    className={clsx(styles.paginationLink, {
                      [styles.activePaginationLink]: currentPage === v,
                    })}
                  >
                    {v}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              scroll={false}
              onClick={handlePaging(currentPage + 1)}
              href={generateLinkUrl({
                key: PAGINATION_QUERY_KEY,
                value: currentPage + 1,
              })}
              disabled={!hasNext}
              className={clsx(styles.paginationLink, {
                [styles.disabledNavigationLink]: !hasNext,
              })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderAIService = () => {
    return (
      <section className={styles['ai-service']}>
        <InkeepCustomTriggerWrapper className={styles['ai-service-wrapper']}>
          <div
            className={styles['ai-service-logo']}
            style={{ backgroundImage: `url(/images/ai-bird.png)` }}
          />
          <div className={styles['ai-service-main']}>
            <h3 className={styles['ai-service-title']}>
              {t('blog:aiService.title')}
            </h3>
            <p className={styles['ai-service-desc']}>
              {t('blog:aiService.desc')}
            </p>
          </div>
          <AirplaneArrowIcon className={styles['ai-service-icon']} />
        </InkeepCustomTriggerWrapper>
      </section>
    );
  };

  const renderAuthors = () => {
    const authors = [
      {
        name: 'Stefan Webb',
        title: 'Developer Advocate, Zilliz',
        avatar: '/images/authors/stefanwebb.png',
      },
      {
        name: 'David Wang',
        title: 'Algorithm Engineer, Zilliz',
        avatar: '/images/authors/davidwang.png',
      },
      {
        name: 'Jiang Chen',
        title: 'Engineering Lead, Zilliz',
        avatar: '/images/authors/jiangchen.png',
      },
    ];

    const authorsItems = authors.map(a => (
      <div className={styles['author']} key={a.name}>
        <div
          className={styles['author-avatar']}
          style={{ backgroundImage: `url(${a.avatar})` }}
        />
        <div className={styles['author-info']}>
          <h4 className={styles['author-name']}>{a.name}</h4>
          <p className={styles['author-title']}>{a.title}</p>
        </div>
      </div>
    ));

    return (
      <section className={styles['authors']}>
        <header className={styles['authors-header']}>
          <h2 className={styles['authors-title']}>{t('blog:authors.title')}</h2>
        </header>
        <div className={styles['authors-list']}>{authorsItems}</div>
      </section>
    );
  };

  return (
    <Layout>
      <Head>
        <title>{t('blog:homepage.title')}</title>
        <meta name="description" content={t('blog:homepage.desc')} />
        <meta property="og:title" content={t('blog:homepage.title')}></meta>
        <meta property="og:description" content={t('blog:homepage.desc')} />
        <meta property="og:url" content={absoluteUrl} />
      </Head>
      <main>
        <section className={styles['banner']}>
          <div className={pageClasses.homeContainer}>
            <div className={styles['banner-detail']}>
              {renderRecommend()}
              {renderRecentTabs()}
            </div>
            {renderSubscribe()}
          </div>
        </section>
        <section className={styles['content']}>
          <div className={pageClasses.homeContainer}>
            <header className={styles['list-header']}>
              {renderFilter()}
              {renderSearcher()}
            </header>
            <section className={styles['list-detail']}>
              {renderBlogList()}
              {renderPaging()}
            </section>
            {renderAIService()}
            <ZillizAdv />
            {renderAuthors()}
          </div>
        </section>
      </main>
    </Layout>
  );
};

interface BlogExtraProps {
  className?: string;
  dark?: boolean;
  data: BlogFrontMatterType;
}

const BlogExtra: React.FC<BlogExtraProps> = props => {
  const { tags, date } = props.data;
  const { t } = useTranslation('blog');
  const displayDate = dayjs(date).format('MMM DD, YYYY');
  const displayTags = tags
    .map(tag => t(`blog:filter.${convertToNewTag(tag)}`))
    .join(' ');
  return (
    <p
      className={clsx(
        styles['blog-extra'],
        props.dark && styles['dark'],
        props.className
      )}
    >
      <span className={styles['blog-extra-tags']}>{displayTags}</span>
      <span className={styles['blog-extra-separator']} />
      <span className={styles['blog-extra-date']}>{displayDate}</span>
    </p>
  );
};

interface BlogCardProps {
  data: BlogFrontMatterType;
  locale: LanguageEnum;
}

const BlogCard: React.FC<BlogCardProps> = props => {
  const { data, locale } = props;
  return (
    <Link
      className={styles['blog-card']}
      href={getBlogLink(data, locale)}
      title={data.title}
    >
      <div
        className={styles['blog-card-img']}
        style={{ backgroundImage: `url(${data.cover})` }}
      />
      <BlogExtra className={styles['blog-card-extra']} data={data} />
      <h3 className={styles['blog-card-title']}>{data.title}</h3>
    </Link>
  );
};

interface TabItem {
  title: React.ReactNode;
  icon: React.ReactNode;
  key: string;
  renderContent: () => React.ReactNode;
}

interface TabsProps {
  className?: string;
  tabs: TabItem[];
  defaultActive?: string;
}

const Tabs: React.FC<TabsProps> = props => {
  const [active, setActive] = useState(
    props.defaultActive || props.tabs[0].key
  );

  const renderTitle = () => {
    const handleActive = (t: string) => () => {
      setActive(t);
    };

    const titles = props.tabs.map(t => (
      <div
        className={clsx(
          styles['tabs-title-item'],
          active === t.key && styles['active']
        )}
        key={t.key}
        onClick={handleActive(t.key)}
      >
        {t.icon}
        {t.title}
      </div>
    ));

    return <div className={styles['tabs-title']}>{titles}</div>;
  };

  const renderContent = () => {
    const activeTab = props.tabs.find(t => t.key === active) || props.tabs[0];
    return (
      <div className={styles['tab-content']} key={activeTab.key}>
        {activeTab.renderContent()}
      </div>
    );
  };

  return (
    <div className={styles.tabs}>
      {renderTitle()}
      {renderContent()}
    </div>
  );
};
