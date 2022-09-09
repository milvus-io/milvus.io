import React, { useState, useMemo } from 'react';
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
import TextField from '@mui/material/TextField';
import {
  memorySizeCalculator,
  rawFileSizeCalculator,
  commonCoordCalculator,
  unitBYTE2Any,
  indexNodeCalculator,
  queryNodeCalculator,
  isBetween,
  rootCoordCalculator,
  dataNodeCalculator,
  proxyCalculator,
  customYmlGenerator,
} from '../../utils/sizingTool';

const INDEX_TYPE_OPTIONS = [
  {
    label: 'HNSW',
    value: 'HNSW',
  },
  {
    label: 'FLAT',
    value: 'FLAT',
  },
  {
    label: 'IVF_FLAT',
    value: 'IVF_FLAT',
  },
  {
    label: 'IVF_SQ8',
    value: 'IVF_SQ8',
  },
];

const SEGMENT_SIZE_OPTIONS = [
  {
    value: '512',
    label: '512MB',
  },
  {
    value: '1024',
    label: '1024MB',
  },
  {
    value: '2048',
    label: '2048MB',
  },
];

// one million
const $1M = Math.pow(10, 6);
/// one billion
const $1B = Math.pow(10, 9);

const defaultSizeContent = {
  size: 'Require more data',
  cpu: 0,
  memory: 0,
  amount: 0,
};

export default function SizingTool() {
  const { language, t } = useI18next();

  const [form, setForm] = useState({
    // number of vectors
    nb: {
      value: 1,
      showError: false,
      helpText: '',
      placeholder: `[1 - 10000]`,
      validation: {
        validate: isBetween,
        params: { min: 1, max: 10000 },
        errorMsg: 'Out of limit',
      },
    },
    // dimensions
    d: {
      value: 128,
      showError: false,
      helpText: '',
      placeholder: '[1 - 10000]',
      validation: {
        validate: isBetween,
        params: { min: 1, max: 10000 },
        errorMsg: 'Out of limit',
      },
    },
    // index type
    indexType: {
      value: INDEX_TYPE_OPTIONS[0].value,
      showError: false,
    },
    // index parameters
    m: {
      value: 8,
      showError: false,
    },
    // ivf parameters
    nlist: {
      value: 1024,
      showError: false,
      helpText: '',
      placeholder: '[1 - 10000]',
      validation: {
        validate: isBetween,
        params: { min: 1, max: 10000 },
        errorMsg: 'Out of limit',
      },
    },
    // segment size
    segmentSize: {
      value: SEGMENT_SIZE_OPTIONS[0].value,
      showError: false,
    },
  });

  const handleFormValueChange = (val, key) => {
    const { validation } = form[key];

    if (!validation) {
      setForm(v => ({
        ...v,
        [key]: {
          ...v[key],
          value: val,
        },
      }));
      return;
    }

    const isValidated = validation.validate(val, validation.params);
    if (isValidated) {
      setForm(v => ({
        ...v,
        [key]: {
          ...v[key],
          value: val,
          showError: false,
          helpText: '',
        },
      }));
    } else {
      setForm(v => ({
        ...v,
        [key]: {
          ...v[key],
          value: val,
          showError: true,
          helpText: validation.errorMsg,
        },
      }));
    }
  };

  const openArrow = <span className={classes.arrowIcon}></span>;

  const calcResult = useMemo(() => {
    const { nb, d, indexType, nlist, m, segmentSize } = form;

    const nbVal = Number(nb.value) * $1M || 0;
    const dVal = Number(d.value) || 0;
    const nlistVal = Number(nlist.value) || 0;
    const mVal = Number(m.value) || 0;
    const sVal = Number(segmentSize.value) || 0;

    const isErrorParameters = Object.values(form).some(v => v.showError);

    if (isErrorParameters) {
      return {
        memorySize: { size: 0, unit: 'B' },
        rawFileSize: { size: 0, unit: 'B' },
        rootCoord: defaultSizeContent,
        dataNode: defaultSizeContent,
        indexNode: defaultSizeContent,
        proxy: defaultSizeContent,
        queryNode: defaultSizeContent,
        commonCoord: defaultSizeContent,
      };
    }

    const { memorySize, theorySize } = memorySizeCalculator({
      nb: nbVal,
      d: dVal,
      nlist: nlistVal,
      M: mVal,
      indexType: indexType.value,
    });

    const rawFileSize = rawFileSizeCalculator({ d: dVal, nb: nbVal });

    const rootCoord = rootCoordCalculator(nbVal);

    const dataNode = dataNodeCalculator(nbVal);

    const indexNode = indexNodeCalculator(theorySize, sVal);

    const proxy = proxyCalculator(memorySize);

    const queryNode = queryNodeCalculator(memorySize);

    const commonCoord = commonCoordCalculator(memorySize);

    return {
      memorySize: unitBYTE2Any(memorySize),
      rawFileSize: unitBYTE2Any(rawFileSize),
      rootCoord,
      dataNode,
      indexNode,
      proxy,
      queryNode,
      commonCoord,
    };
  }, [form]);

  const handleDownloadYmlFile = () => {
    if (typeof window !== 'undefined') {
      const content = customYmlGenerator({
        ...calcResult,
      });
      const blob = new Blob([content], {
        type: 'text/plain',
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'customConfig.yml';
      a.click();
    }
  };

  return (
    <Layout t={t}>
      <Seo lang={language} title={t('v3trans.sizingTool.title')}></Seo>
      <main className={classes.main}>
        <div className={classes.pageContainer}>
          <h1>{t('v3trans.sizingTool.title')}</h1>
          <div className={classes.note}>
            <span className={classes.iconWrapper}>
              <InfoFilled />
            </span>
            <h2>{t('v3trans.sizingTool.subTitle')}</h2>
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.leftPart}>
              <div className={classes.dataSize}>
                <h3>{t('v3trans.sizingTool.labels.dataSize')}</h3>

                <div className={classes.dataItem}>
                  <p className={classes.label}>
                    {t('v3trans.sizingTool.labels.vector')}
                  </p>
                  <div>
                    <TextField
                      fullWidth
                      error={form.nb.showError}
                      label={t('v3trans.sizingTool.labels.vector')}
                      value={form.nb.value}
                      helperText={form.nb.helpText}
                      placeholder={form.nb.placeholder}
                      onChange={e => {
                        handleFormValueChange(e.target.value, 'nb');
                      }}
                    />
                  </div>
                </div>

                <div className={classes.dataItem}>
                  <p className={classes.label}>
                    {t('v3trans.sizingTool.labels.dimension')}
                  </p>
                  <div>
                    <TextField
                      fullWidth
                      error={form.d.showError}
                      label={t('v3trans.sizingTool.labels.dimension')}
                      value={form.d.value}
                      helperText={form.d.helpText}
                      placeholder={form.d.placeholder}
                      onChange={e => {
                        handleFormValueChange(e.target.value, 'd');
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={classes.indexType}>
                <h3>{t('v3trans.sizingTool.labels.indexType')}</h3>

                <div className={classes.dataItem}>
                  <Dropdown
                    options={INDEX_TYPE_OPTIONS}
                    onChange={data => {
                      handleFormValueChange(data.value, 'indexType');
                    }}
                    value={form.indexType.value}
                    placeholder={form.indexType.helpText}
                    controlClassName={classes.dropdownController}
                    menuClassName={classes.dropdownMenu}
                    arrowOpen={openArrow}
                    arrowClosed={openArrow}
                  />
                </div>

                <div className={classes.dataItem}>
                  {form.indexType.value === 'FLAT' ? null : form.indexType
                      .value === 'HNSW' ? (
                    <>
                      <p className={clsx(classes.label, classes.shortMargin)}>
                        {t('v3trans.sizingTool.labels.indexParam')}
                      </p>
                      <p
                        className={clsx(
                          classes.interpretation,
                          classes.largeMargin
                        )}
                      >
                        {t('v3trans.sizingTool.labels.m')}
                      </p>
                      <div className={classes.sliderWrapper}>
                        <Slider
                          value={form.m.value}
                          step={2}
                          min={4}
                          max={64}
                          valueLabelDisplay="on"
                          onChange={e => {
                            handleFormValueChange(e.target.value, 'm');
                          }}
                          marks={[
                            { label: '4', value: 4 },
                            { label: '64', value: 64 },
                          ]}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={classes.interpretation}>
                        {t('v3trans.sizingTool.labels.m')}
                      </p>
                      <div>
                        <TextField
                          fullWidth
                          error={form.nlist.showError}
                          label="nlist"
                          value={form.nlist.value}
                          helperText={form.nlist.helpText}
                          placeholder={form.nlist.placeholder}
                          onChange={e => {
                            handleFormValueChange(e.target.value, 'nlist');
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={classes.dataItem}>
                  <p className={clsx(classes.label, classes.shortMargin)}>
                    {t('v3trans.sizingTool.labels.segmentSize')}
                  </p>
                  <p className={classes.interpretation}>
                    {t('v3trans.sizingTool.labels.segment')}
                  </p>
                  <div>
                    <Dropdown
                      options={SEGMENT_SIZE_OPTIONS}
                      onChange={data => {
                        handleFormValueChange(data.value, 'segmentSize');
                      }}
                      value={form.segmentSize.value}
                      placeholder="Segement"
                      controlClassName={classes.dropdownController}
                      menuClassName={classes.dropdownMenu}
                      arrowOpen={openArrow}
                      arrowClosed={openArrow}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.rightPart}>
              <div className={classes.capacity}>
                <h3>{t('v3trans.sizingTool.capacity')}</h3>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title={t('v3trans.sizingTool.memory')}
                    content={`${calcResult.memorySize.size} ${calcResult.memorySize.unit}`}
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                  <SizingToolCard
                    title={t('v3trans.sizingTool.fileSize')}
                    content={`${calcResult.rawFileSize.size} ${calcResult.rawFileSize.unit}`}
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                </div>
              </div>

              <div className={classes.cluster}>
                <h3>{t('v3trans.sizingTool.setups.title')}</h3>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.rootCoord.title')}
                    subTitle={calcResult.rootCoord.size}
                    content={calcResult.rootCoord.amount}
                    showTooltip
                    tooltip={t('v3trans.sizingTool.setups.rootCoord.tooltip')}
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.indexCoord.title')}
                    tooltip={t('v3trans.sizingTool.setups.indexCoord.tooltip')}
                    showTooltip
                    subTitle={calcResult.commonCoord.size}
                    content={calcResult.commonCoord.amount}
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.queryCoord.title')}
                    tooltip={t('v3trans.sizingTool.setups.queryCoord.tooltip')}
                    showTooltip
                    subTitle={calcResult.commonCoord.size}
                    content={calcResult.commonCoord.amount}
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.dataCoord.title')}
                    tooltip={t('v3trans.sizingTool.setups.dataCoord.tooltip')}
                    showTooltip
                    subTitle={calcResult.commonCoord.size}
                    content={calcResult.commonCoord.amount}
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.proxy.title')}
                    tooltip={t('v3trans.sizingTool.setups.proxy.tooltip')}
                    subTitle={calcResult.proxy.size}
                    content={calcResult.proxy.amount}
                    showTooltip
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.queryNode.title')}
                    tooltip={t('v3trans.sizingTool.setups.queryNode.tooltip')}
                    subTitle={calcResult.queryNode.size}
                    content={calcResult.queryNode.amount}
                    showTooltip
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.dataNode.title')}
                    tooltip={t('v3trans.sizingTool.setups.dataNode.tooltip')}
                    subTitle={calcResult.dataNode.size}
                    content={calcResult.dataNode.amount}
                    showTooltip
                  />

                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.indexNode.title')}
                    tooltip={t('v3trans.sizingTool.setups.indexNode.tooltip')}
                    subTitle={calcResult.indexNode.size}
                    content={calcResult.indexNode.amount}
                    showTooltip
                  />
                </div>
              </div>

              <button
                className={classes.downloadBtn}
                onClick={handleDownloadYmlFile}
              >
                <DownloadIcon />
                <span>{t('v3trans.sizingTool.button')}</span>
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
