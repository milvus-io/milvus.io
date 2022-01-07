import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/layout";
// import BannerCard from '../components/card/bannerCard';
// import LinkCard from '../components/card/linkCard';
// import SolutionCard from '../components/card/solutionCard';
// import Seo from '../components/seo';
// import imageSearch from '../images/doc-home/image_search.svg';
// import audioSearch from '../images/doc-home/audio-search.svg';
// import hybrid from '../images/doc-home/hybrid.svg';
// import molecular from '../images/doc-home/molecular.svg';
// import questionAnswering from '../images/doc-home/question_answering.svg';
// import recommend from '../images/doc-home/recommend.svg';
// import videoSearch from '../images/doc-home/video-search.svg';
// import Header from '../components/header/v2';
// import { useMobileScreen } from '../hooks/index';
// import { useCodeCopy, useFilter } from '../hooks/doc-dom-operation';
// import './bootcampTemplate.less';
// import { useFormatAnchor } from '../hooks/doc-anchor';

// const Icons = {
//   IMAGE_SEARCH: imageSearch,
//   QUESTION_ANSWER: questionAnswering,
//   RECOMMENDATION: recommend,
//   VIDEO_SEARCH: videoSearch,
//   AUDIO_SEARCH: audioSearch,
//   MOLECULAR: molecular,
//   HYBRID: hybrid,
// };

// const BootcampTemplate = ({ data, pageContext }) => {
//   const { bootcampData, locale, html, headings } = pageContext;
//   const isHomePage = bootcampData !== null;

//   const { banner, title, description, section1, section3, section4 } =
//     bootcampData || {};

//   const SeoTitle = 'Milvus Bootcamp';
//   const desc = 'Join Milvus Bootcamp';

//   const {
//     footer: { content: anchorTitleTrans },
//   } = data.allFile.edges.filter(edge => edge.node.childI18N)[0].node.childI18N
//     .layout;

//   const {
//     footer: { licence: footerTrans },
//   } = data.allFile.edges.filter(edge => edge.node.childI18N)[0].node.childI18N
//     .v2;

//   // add hooks used by doc template
//   useFilter();
//   useCodeCopy(locale);
//   useFormatAnchor();

//   const [hash, setHash] = useState(null);
//   const [showToTopButton, setShowToTopButton] = useState(false);

//   useEffect(() => {
//     let currentPos = 0;

//     const cb = function () {
//       const container = document.querySelector('html');
//       const direction = container.scrollTop - currentPos > 0 ? 'down' : 'up';
//       currentPos = container.scrollTop;
//       const showButton = direction === 'up' && currentPos;

//       setShowToTopButton(showButton);
//     };
//     window.addEventListener('scroll', cb);

//     return () => {
//       window.removeEventListener('scroll', cb);
//     };
//   }, []);

//   const formatHeadings =
//     headings &&
//     headings.reduce((pre, cur) => {
//       const copyCur = JSON.parse(JSON.stringify(cur));
//       const preHead = pre[pre.length - 1];
//       if (preHead && preHead.depth < cur.depth) {
//         pre[pre.length - 1].children.push(cur);
//       } else {
//         copyCur.children = [];
//         pre = [...pre, copyCur];
//       }
//       return pre;
//     }, []);

//   const generateAnchorMenu = (headings, className) => {
//     return headings.map(v => {
//       const normalVal = v.value.replace(/[.｜,｜/｜'｜?｜？｜、|，]/g, '');
//       const anchor = normalVal.split(' ').join('-');
//       let childDom = null;
//       if (v.children && v.children.length) {
//         childDom = generateAnchorMenu(v.children, 'child-item');
//       }
//       return (
//         <div className={`item ${className}`} key={v.value}>
//           <a
//             href={`#${anchor}`}
//             title={v.value}
//             className={`anchor ${anchor === hash ? 'active' : ''}`}
//             onClick={() => setHash(anchor)}
//           >
//             {v.value}
//           </a>
//           {childDom}
//         </div>
//       );
//     });
//   };

//   const onToTopClick = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   const { isMobile } = useMobileScreen();
//   return (
//     <div className="bootcamp-wrapper">
//       <Header locale={locale} />
//       <Seo title={SeoTitle} lang={locale} description={desc} />
//       <main className="mainContainer">
//         {isHomePage ? (
//           <section className="content bootcamp">
//             <div className="container">
//               <BannerCard
//                 content={description}
//                 title={title}
//                 img={banner.img.publicURL}
//                 isMobile={isMobile}
//               />
//             </div>

//             <div className="container">
//               <h1 className="title">{section1.title}</h1>
//               <ul className="solutionsWrapper">
//                 {section1.content.map(item => {
//                   const { title, link } = item;
//                   return (
//                     <li key={title}>
//                       <LinkCard
//                         label={title}
//                         href={link}
//                         className="link-card"
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//             <div className="container">
//               <h1 className="title">{section3.title}</h1>
//               <ul className="solutionsWrapper">
//                 {section3.content.map(item => {
//                   const { title, link, iconType, desc, liveDemo } = item;
//                   return (
//                     <li key={title}>
//                       <SolutionCard
//                         title={title}
//                         content={desc}
//                         img={Icons[iconType]}
//                         href={link}
//                         liveDemo={liveDemo}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             <div className="container">
//               <h1 className="title">{section4.title}</h1>
//               <ul className="solutionsWrapper">
//                 {section4.content.map(item => {
//                   const { title, link, desc } = item;
//                   return (
//                     <li key={title}>
//                       <SolutionCard title={title} content={desc} href={link} />
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </section>
//         ) : (
//           <>
//             <section className="content articles doc-post">
//               {html && (
//                 <section
//                   className="doc-post-container articles-container"
//                   dangerouslySetInnerHTML={{ __html: html }}
//                 ></section>
//               )}
//             </section>
//             {formatHeadings.length > 0 && (
//               <div className="anchors-wrapper">
//                 <div className="anchors">
//                   <h4 className="anchor-title">{anchorTitleTrans}</h4>
//                   {generateAnchorMenu(formatHeadings, 'parent-item')}
//                 </div>
//               </div>
//             )}
//             {showToTopButton ? (
//               <div
//                 className="btn-to-top"
//                 role="button"
//                 onClick={onToTopClick}
//                 onKeyDown={onToTopClick}
//                 tabIndex={0}
//               >
//                 <svg
//                   width="32"
//                   height="32"
//                   focusable="false"
//                   role="img"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 384 512"
//                   className="svg-inline--fa fa-arrow-to-top fa-w-12 fa-2x"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm66.4 280.5l65.6-65.6V456c0 13.3 10.7 24 24 24h24c13.3 0 24-10.7 24-24V246.9l65.6 65.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L209 126.1c-9.4-9.4-24.6-9.4-33.9 0L39.5 261.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0z"
//                   ></path>
//                 </svg>
//               </div>
//             ) : null}
//           </>
//         )}
//       </main>
//       <footer>
//         <span>{footerTrans.text1.label}</span>
//         <a className="link" href={footerTrans.text2.link}>
//           {footerTrans.text2.label}
//         </a>
//         {`, ${footerTrans.text3.label}`}
//       </footer>
//     </div>
//   );
// };

// export const Query = graphql`
//   query bootcampQuery($locale: String) {
//     allFile(filter: { name: { eq: $locale } }) {
//       edges {
//         node {
//           childI18N {
//             v2 {
//               footer {
//                 licence {
//                   text1 {
//                     label
//                     link
//                   }
//                   text2 {
//                     label
//                     link
//                   }
//                   text3 {
//                     label
//                     link
//                   }
//                   list {
//                     label
//                     link
//                   }
//                 }
//               }
//             }
//             layout {
//               footer {
//                 content
//               }
//               community {
//                 slack
//                 github
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export default BootcampTemplate;
export default function Template({ data, pageContext }) {
  const { t } = useI18next();
  return (
    <Layout t={t}>
      <div>test</div>
    </Layout>
  );
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;
