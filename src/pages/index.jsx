import * as React from "react";
import { graphql } from "gatsby";
import "./index.less";
import Layout from "../components/layout";
import { useI18next } from "gatsby-plugin-react-i18next";

// markup
const IndexPage = () => {
  const { t } = useI18next();

  return (
    <main className="main">
      <Layout darkMode={true} t={t}>
        <div className="banner">
          <div className="shooting_star_container1">
            <div className="shooting_star"></div>
          </div>
          <div className="shooting_star_container2">
            <div className="shooting_star"></div>
          </div>
          <div className="banner-grid-container col-12 col-8 col-4">
            <p className="title">
              Vector database built for scalable similarity search
            </p>
            <p className="subtitle">
              Open-source, highly scalable, and blazing fast
            </p>
            <div className="btn-group">
              <button className="btn-start">Get Started</button>
              <button className="btn-watch">
                Watch Video
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="m10 16.5 6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="white"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="bucket bucket-container ">
              <svg
                // width="340"
                // height="120"
                xmlns="http://www.w3.org/2000/svg"
                className="ellipse-svg2"
                viewBox="0 0 340 120"
              >
                <defs>
                  <linearGradient
                    xmlns="http://www.w3.org/2000/svg"
                    id="linear"
                    x1="20.375"
                    y1="8.27045"
                    x2="211.439"
                    y2="-100.567"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#B7FFEE" stopOpacity="0" />
                    <stop offset="1" stopColor="#18E0B2" />
                  </linearGradient>
                </defs>
                <path
                  id="path"
                  d="M2 120 C 2 120 32 2 166 2 C 300 2 336.5 120 336.5 120"
                  stroke="url(#linear)"
                  strokeWidth="6"
                  fill="none"
                  filter="drop-shadow(0 0 3px rgba(105, 155, 255, 1))"
                  clipPath="url(#shape--start)"
                />
                <defs>
                  <clipPath id="shape--start">
                    <circle
                      className="circle"
                      cx="-596"
                      cy="0"
                      r="600"
                      stroke="#f70202"
                      strokeWidth="2"
                      fill="#f92020"
                    >
                      <animateMotion
                        dur="5s"
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath xlinkHref="#path" />
                      </animateMotion>
                    </circle>
                  </clipPath>
                </defs>
                <circle
                  className="circle"
                  cx="0"
                  cy="0"
                  r="6"
                  stroke="url(#linear2)"
                  strokeWidth="2"
                  fill="#42FFD2"
                >
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath xlinkHref="#path" />
                  </animateMotion>
                </circle>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                // width="16"
                // height="213"
                viewBox="0 0 16 213"
                fill="none"
                className="line-svg1"
              >
                <defs>
                  <filter
                    id="filter0_f_478_1764"
                    x="0.000976562"
                    y="0"
                    width="12"
                    height="213"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_1764"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_478_1764"
                    x1="6.00087"
                    y1="207.045"
                    x2="9.84884"
                    y2="6.0641"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.140625"
                      stop-color="white"
                      stop-opacity="0"
                    />
                    <stop offset="1" stop-color="#0066FF" />
                  </linearGradient>
                  <filter
                    xmlns="http://www.w3.org/2000/svg"
                    id="filter0_f_478_1765"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1"
                      result="effect1_foregroundBlur_478_1765"
                    />
                  </filter>
                  <clipPath id="line1-clip">
                    <circle
                      className="circle"
                      cx="-100"
                      cy="0"
                      r="100"
                      stroke="#f70202"
                      strokeWidth="2"
                      fill="#f92020"
                    >
                      <animateMotion
                        dur="5s"
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath xlinkHref="#line-path-1" />
                      </animateMotion>
                    </circle>
                  </clipPath>
                </defs>
                <path
                  d="M6 207L6 6"
                  stroke="url(#paint0_linear_478_1764)"
                  stroke-width="4"
                  stroke-linecap="round"
                  id="line-path-1"
                  clipPath="url(#line1-clip)"
                  filter="url(#filter0_f_478_1764)"
                />
                <circle
                  cx="6"
                  cy="0"
                  r="6"
                  fill="#83A5FF"
                  // filter="url(#filter0_f_478_1765)"
                  filter="drop-shadow(0 0 3px rgba(105, 155, 255, 1))"
                >
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath xlinkHref="#line-path-1" />
                  </animateMotion>
                </circle>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                className="static-circle1"
              >
                <g filter="url(#filter0_f_478_1767)">
                  <circle cx="14.501" cy="14.5" r="10.5" fill="#00FFFF" />
                </g>
                <defs>
                  <filter
                    id="filter0_f_478_1767"
                    x="0.000976562"
                    y="0"
                    width="29"
                    height="29"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_1767"
                    />
                  </filter>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="87"
                viewBox="0 0 12 87"
                fill="none"
                className="static-line1"
              >
                <g filter="url(#filter0_f_478_1769)">
                  <path
                    d="M6.00098 6L6.00098 81"
                    stroke="url(#paint0_linear_478_1769)"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_478_1769"
                    x="0.000976562"
                    y="0"
                    width="12"
                    height="87"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_1769"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_478_1769"
                    x1="6.00087"
                    y1="81.0166"
                    x2="6.53679"
                    y2="6.00026"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.140625"
                      stop-color="white"
                      stop-opacity="0"
                    />
                    <stop offset="1" stop-color="#0066FF" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="155"
                viewBox="0 0 12 155"
                fill="none"
                className="static-line2"
              >
                <g filter="url(#filter0_f_478_1770)">
                  <path
                    d="M6.00098 149V6"
                    stroke="url(#paint0_linear_478_1770)"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_478_1770"
                    x="0.000976562"
                    y="0"
                    width="12"
                    height="155"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_1770"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_478_1770"
                    x1="6.00109"
                    y1="5.9683"
                    x2="4.05307"
                    y2="148.98"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.140625"
                      stop-color="white"
                      stop-opacity="0"
                    />
                    <stop offset="1" stop-color="#FF8F00" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                // width="12"
                // height="213"
                viewBox="0 0 12 213"
                fill="none"
                className="line-svg2"
              >
                {/* <g filter="url(#filter0_f_478_1761)">
                      <path
                        d="M6.00098 207V6"
                        stroke="url(#paint0_linear_478_1761)"
                        stroke-width="4"
                        stroke-linecap="round"
                      />
                    </g> */}
                <path
                  d="M6 6L6 207"
                  stroke="url(#paint0_linear_478_1761)"
                  stroke-width="4"
                  stroke-linecap="round"
                  filter="url(#filter0_f_478_1761)"
                  id="line-path-2"
                  clipPath="url(#line2-clip)"
                />
                <circle
                  xmlns="http://www.w3.org/2000/svg"
                  cx="6"
                  cy="0"
                  r="6"
                  fill="#FFD49D"
                  // filter="url(#filter0_f_478_1762)"
                  filter="drop-shadow(0 0 3px rgba(255, 212, 157, 1))"
                >
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath xlinkHref="#line-path-2" />
                  </animateMotion>
                </circle>
                <defs>
                  <filter
                    id="filter0_f_478_1761"
                    x="0.000976562"
                    y="0"
                    width="12"
                    height="213"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_1761"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_478_1761"
                    x1="6.00109"
                    y1="5.95544"
                    x2="2.1531"
                    y2="206.936"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.140625"
                      stop-color="white"
                      stop-opacity="0"
                    />
                    <stop offset="1" stop-color="#FF8F00" />
                  </linearGradient>
                  <filter
                    xmlns="http://www.w3.org/2000/svg"
                    id="filter0_f_478_1762"
                    x="0.000976562"
                    y="0"
                    width="16"
                    height="16"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1"
                      result="effect1_foregroundBlur_478_1762"
                    />
                  </filter>
                  <filter
                    xmlns="http://www.w3.org/2000/svg"
                    id="filter0_f_478_1762"
                    x="0.000976562"
                    y="0"
                    width="16"
                    height="16"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1"
                      result="effect1_foregroundBlur_478_1762"
                    />
                  </filter>
                  <clipPath id="line2-clip">
                    <circle
                      className="circle"
                      cx="-100"
                      cy="0"
                      r="100"
                      stroke="#f70202"
                      strokeWidth="2"
                      fill="#f92020"
                    >
                      <animateMotion
                        dur="5s"
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath xlinkHref="#line-path-2" />
                      </animateMotion>
                    </circle>
                  </clipPath>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                // width="13"
                // height="42"
                viewBox="0 0 13 42"
                fill="none"
                className="static-line3"
              >
                <g filter="url(#filter0_f_478_2074)">
                  <path
                    d="M6.91016 6.39999L6.91016 35.0659"
                    stroke="url(#paint0_linear_478_2074)"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </g>
                <g
                  xmlns="http://www.w3.org/2000/svg"
                  filter="url(#filter0_f_478_2071)"
                >
                  <circle
                    cx="7.63402"
                    cy="8.36815"
                    r="3.58324"
                    fill="#E5FF58"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_478_2074"
                    x="0.910156"
                    y="0.399902"
                    width="12"
                    height="40.666"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_2074"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_478_2074"
                    x1="6.91005"
                    y1="35.0723"
                    x2="6.98834"
                    y2="6.39884"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.140625"
                      stop-color="white"
                      stop-opacity="0"
                    />
                    <stop offset="1" stop-color="#E5FF59" />
                  </linearGradient>
                  <filter
                    xmlns="http://www.w3.org/2000/svg"
                    id="filter0_f_478_2071"
                    x="0.0507812"
                    y="0.784912"
                    width="15.166"
                    height="15.1665"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="2"
                      result="effect1_foregroundBlur_478_2071"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="stats col-3 col-8">
              <div className="stats-detail">
                <p className="name">Stars at Github</p>
                <p className="num">9k+</p>
              </div>
              <div className="stats-detail">
                <p className="name">Contirbutors</p>
                <p className="num">150</p>
              </div>
              <div className="stats-detail">
                <p className="name">Downloads</p>
                <p className="num">60M</p>
              </div>
              <div className="stats-detail">
                <p className="name">Customers</p>
                <p className="num">1500+</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
};

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

export default IndexPage;
