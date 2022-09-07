import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Seo from '../../components/seo';
import Layout from '../../components/layout';
import { useI18next } from 'gatsby-plugin-react-i18next';
import * as classes from './sizingTool.module.less';
import { InfoFilled, DownloadIcon } from '../../components/icons';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import SizingToolCard from '../../components/card/sizingToolCard';
import clsx from 'clsx';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const options = [
  {
    label: 'FLAT',
    value: 0,
  },
  {
    label: 'IVE_FLAT',
    value: 1,
  },
  {
    label: 'IVE_SQ8',
    value: 2,
  },
  {
    label: 'HNSW',
    value: 3,
  },
  {
    label: 'IVE_PQ',
    value: 4,
  },
];

const verctorMarks = [
  {
    value: 1,
    label: '1K',
  },
  {
    value: 2,
    label: '10K',
  },
  {
    value: 3,
    label: '100K',
  },
  {
    value: 4,
    label: '1M',
  },
  {
    value: 5,
    label: '10M',
  },
  {
    value: 6,
    label: '100M',
  },
  {
    value: 7,
    label: '1G',
  },
  {
    value: 8,
    label: '10G',
  },
];

export default function SizingTool() {
  const { language, t } = useI18next();
  const [indexType, setIndexType] = useState(options[0].value);

  const handleOptionChange = val => {
    console.log(val);
  };

  const openArrow = <span className={classes.arrowIcon}></span>;

  return (
    <Layout t={t}>
      <Seo lang={language} title="Milvus Sizing Tool"></Seo>
      <main className={classes.main}>
        <div className={classes.pageContainer}>
          <h1>Milvus Sizing Tool</h1>
          <h2></h2>
          <div className={classes.note}>
            <span className={classes.iconWrapper}>
              <InfoFilled />
            </span>
            <p>
              Note: all the recommendations are calculated based our lab data,
              you should adjust it with your own testing before deploying to
              production.
            </p>
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.leftPart}>
              <div className={classes.dataSize}>
                <h3>Choose data size</h3>
                <div className={classes.dataItem}>
                  <p className={classes.label}>Number of vectors</p>
                  <div className={classes.sliderWrapper}>
                    <Slider
                      defaultValue={1}
                      step={1}
                      min={1}
                      max={8}
                      marks={verctorMarks}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>

                <div className={classes.dataItem}>
                  <p className={classes.label}>Dimensions</p>
                  <div className={classes.sliderWrapper}>
                    <Slider
                      defaultValue={1}
                      step={1}
                      min={1}
                      max={8}
                      marks={verctorMarks}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>

              <div className={classes.indexType}>
                <h3>Choose index type</h3>
                <div className={classes.dataItem}>
                  <Dropdown
                    options={options}
                    onChange={handleOptionChange}
                    value={indexType}
                    placeholder="Select an option"
                    controlClassName={classes.dropdownControler}
                    menuClassName={classes.dropdownMenu}
                    arrowOpen={openArrow}
                    arrowClosed={openArrow}
                  />

                  {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      value={indexType}
                      onChange={handleOptionChange}
                      displayEmpty
                      classes={{
                        select: classes.dropdownControler,
                      }}
                    >
                      {options.map(v => (
                        <MenuItem value={v.value} key={v.value}>
                          {v.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
                </div>

                <div className={classes.dataItem}>
                  <p className={clsx(classes.label, classes.shortMargin)}>
                    Choose index parameters
                  </p>
                  <p className={classes.interpretation}>
                    M (Maximum degree of the node)
                  </p>
                  <div className={classes.sliderWrapper}>
                    <Slider
                      defaultValue={1}
                      step={1}
                      min={1}
                      max={8}
                      marks={verctorMarks}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>

                <div className={classes.dataItem}>
                  <p className={clsx(classes.label, classes.shortMargin)}>
                    Choose segment size
                  </p>
                  <p className={classes.interpretation}>Segment (MB)</p>
                  <div className={classes.sliderWrapper}>
                    <Slider
                      defaultValue={1}
                      step={1}
                      min={1}
                      max={8}
                      marks={verctorMarks}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.rightPart}>
              <div className={classes.capacity}>
                <h3>Approximate capacity</h3>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title="Memory"
                    content="125 GB"
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                  <SizingToolCard
                    title="Raw  file size"
                    content="125 GB"
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                </div>
              </div>

              <div className={classes.cluster}>
                <h3>Minimum Milvus cluster setup</h3>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title="Root Coord"
                    subTitle="1 core 4 GB"
                    content="x 1"
                    showTooltip
                    tooltip="Currently only supports single nodes, 2c4g is recommended for scenarios with 1B and above data or large data requests."
                    id={1}
                  />

                  <SizingToolCard
                    title="Root Coord"
                    subTitle="1 core 4 GB"
                    content="x 1"
                    showTooltip
                    tooltip="Currently only supports single nodes, 2c4g is recommended for scenarios with 1B and above data or large data requests."
                    id={2}
                  />

                  <SizingToolCard
                    title="Root Coord"
                    subTitle="1 core 4 GB"
                    content="x 1"
                    showTooltip
                    tooltip="Currently only supports single nodes, 2c4g is recommended for scenarios with 1B and above data or large data requests."
                    id={3}
                  />

                  <SizingToolCard
                    title="Root Coord"
                    subTitle="1 core 4 GB"
                    content="x 1"
                    showTooltip
                    tooltip="Currently only supports single nodes, 2c4g is recommended for scenarios with 1B and above data or large data requests."
                    id={4}
                  />

                  <SizingToolCard
                    title="Root Coord"
                    subTitle="1 core 4 GB"
                    content="x 1"
                    showTooltip
                    tooltip="Currently only supports single nodes, 2c4g is recommended for scenarios with 1B and above data or large data requests."
                    id={5}
                  />
                </div>
              </div>

              <button className={classes.downloadBtn}>
                <DownloadIcon />
                <span>Download helm</span>
              </button>
            </div>
          </div>
        </div>
      </main>
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
