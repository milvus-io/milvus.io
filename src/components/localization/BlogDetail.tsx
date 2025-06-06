import React, { useMemo, useRef } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import Tags from '@/components/tags';
import BlogCard from '@/components/card/BlogCard';
import dayjs from 'dayjs';
import Share from '@/components/share';
import styles from '@/styles/blogDetail.module.less';
import { copyToCommand } from '@/utils/common';
import clsx from 'clsx';
import BlogAnchorSection from '@/parts/blogs/blogAnchors';
import pageClasses from '@/styles/responsive.module.less';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect } from 'react';
import { checkIconTpl, linkIconTpl } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { LanguageEnum } from '@/types/localization';
import { getBlogPath } from '@/utils/localization';
import Breadcrumb from '../breadcrumb';

export function BlogDetail(props) {
  const {
    locale,
    newHtml,
    author,
    date,
    tags,
    title,
    id,
    desc,
    cover,
    anchorList,
    codeList,
    moreBlogs,
    meta_title,
    meta_keywords = 'vector databases, milvus, open-source vector database, vector search',
  } = props;
  const router = useRouter();
  const docContainer = useRef(null);
  const { t } = useTranslation(['blog'], { lng: locale });
  const { t: headerTrans } = useTranslation('header');
  const pageHref = useRef('');

  // remove special tag generated by remarkable
  const html = newHtml.replace(/<custom-h1>.*?<\/custom-h1>/g, '');

  const homePath = locale === LanguageEnum.ENGLISH ? '/' : `/${locale}`;
  const blogPath = getBlogPath(locale);
  const shareUrl = useMemo(() => {
    return `${ABSOLUTE_BASE_URL}${blogPath}/${id}`;
  }, [id, blogPath]);
  const dateTime = useMemo(() => dayjs(date).format('MMMM DD, YYYY'), [date]);

  useCopyCode(codeList);

  const handleTagClick = tag => {
    router.push(`/blog?page=1#${tag}`);
  };

  useEffect(() => {
    // add click event handler for copy icon after headings
    if (window && typeof window !== 'undefined') {
      const anchors = Array.from(document.querySelectorAll('.anchor-icon'));
      const baseHref = window.location.href.split('#')[0];

      anchors.forEach(anchor => {
        anchor.addEventListener(
          'click',
          e => {
            if (!e.currentTarget) {
              return;
            }
            const {
              dataset: { href },
            } = e.currentTarget as HTMLAnchorElement;
            pageHref.current = `${baseHref}${href}`;
            copyToCommand(pageHref.current);

            anchor.innerHTML = checkIconTpl;

            setTimeout(() => {
              anchor.innerHTML = linkIconTpl;
            }, 3000);
          },
          false
        );
      });
    }
    // close mask when router changed
    // isOpenMobileMenu && setIsOpenMobileMenu(false);
    // no need to watch 'isOpenMobileMenu'
    // eslint-disable-next-line
  }, [id]);

  const metaTitle = `${meta_title || title} - Milvus Blog`;
  const formattedDesc = desc ? desc.replaceAll(/\"/g, '\\"') : '';

  const ldJson = `{"@context": "http://schema.org", "@id": "${shareUrl}", "@type": "Article", "headline": "${title}", "description": "${formattedDesc}", "datePublished": "${new Date(
    date
  ).toJSON()}", "name": "${title}", "url": "${shareUrl}"}`;

  const blogLink = locale === 'en' ? '/blog' : `/${locale}/blog`;
  const blogLabel = headerTrans('blog');

  return (
    <main>
      <Layout>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={desc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={desc} />
          <meta property="og:url" content={shareUrl} />
          <meta property="og:image" content={`https://${cover}`} />
          <meta name="keywords" content={meta_keywords} />
          <link
            rel="stylesheet"
            href="https://assets.zilliz.com/katex/katex.min.css"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: ldJson }}
          ></script>
        </Head>
        <div>
          <div className={clsx(pageClasses.docContainer, styles.upLayout)}>
            <section className={styles.blogHeader}>
              <Breadcrumb
                list={[
                  {
                    label: blogLabel,
                    href: blogLink,
                  },
                  {
                    label: title,
                  },
                ]}
                lang={locale}
              />

              <h1 className={styles.title}>{title}</h1>

              <div className={styles.subTitle}>
                <Tags
                  list={tags}
                  tagsClass={styles.tags}
                  onClick={handleTagClick}
                />
                <div className={styles.subTitleSeparator} />
                <span className={styles.date}>{dateTime}</span>
                <div className={styles.subTitleSeparator} />
                {author && <span className={styles.author}>{author}</span>}
              </div>
            </section>

            <section className={styles.blogContent}>
              <div
                className={clsx(
                  'doc-style',
                  'scroll-padding',
                  'blog-style',
                  styles.articleContainer
                )}
                ref={docContainer}
                dangerouslySetInnerHTML={{ __html: html }}
              ></div>

              <div className={styles.anchorsContainer}>
                <BlogAnchorSection
                  anchors={anchorList}
                  shareUrl={shareUrl}
                  title={title}
                  description={desc}
                  container={docContainer}
                  imgUrl={`https://${cover}`}
                  id={id}
                  classes={{
                    root: styles.anchorContainer,
                  }}
                />
              </div>
            </section>

            <section className={styles.mobileShareSection}>
              <p>Like the article? Spread the word</p>
              <Share
                url={shareUrl}
                quote={title}
                desc={desc}
                image={cover}
                wrapperClass={styles.share}
                vertical={false}
              />
            </section>
          </div>

          <section
            className={clsx(pageClasses.docContainer, styles.bottomLayout)}
          >
            <h2 className={styles.title}>{t('blog:detail.keepReading')}</h2>
            <ul className={styles.blogCards}>
              {moreBlogs.map((v, index) => {
                const { desc, cover, tags, title, id } = v;
                return (
                  <li key={index}>
                    <BlogCard
                      locale={locale as LanguageEnum}
                      title={title}
                      cover={cover}
                      desc={desc}
                      tags={tags}
                      path={id}
                      direction="row"
                      disableWrapperLink={true}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </Layout>
    </main>
  );
}
