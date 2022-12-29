import React, { useState, useMemo } from 'react';
import { graphql } from 'gatsby';
import Seo from '../../components/seo';
import Layout from '../../components/layout';
import { useI18next } from 'gatsby-plugin-react-i18next';
import * as classes from './sizingTool.module.less';
import { InfoFilled, DownloadIcon } from '../../components/icons';
import SizingToolCard from '../../components/card/sizingToolCard';
import SizingConfigCard from '../../components/card/sizingToolCard/sizingConfigCard';
import clsx from 'clsx';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { findLatestVersion } from '../../utils';

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
  helmYmlGenerator,
  operatorYmlGenerator,
  etcdCalculator,
  minioCalculator,
  pulsarCalculator,
  kafkaCalculator,
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

const defaultSizeContent = {
  size: 'Require more data',
  cpu: 0,
  memory: 0,
  amount: 0,
};

export default function SizingTool({ data }) {
  const { allVersion } = data;
  const { language, t } = useI18next();

  const [form, setForm] = useState({
    // number of vectors
    nb: {
      value: 1,
      showError: false,
      helpText: '',
      placeholder: `[1, 10000]`,
      validation: {
        validate: isBetween,
        params: { min: 1, max: 10000 },
        errorMsg: 'Number of vectors should be an integer between [1, 10000]',
      },
    },
    // dimensions
    d: {
      value: 128,
      showError: false,
      helpText: '',
      placeholder: '[1, 10000]',
      validation: {
        validate: isBetween,
        params: { min: 1, max: 10000 },
        errorMsg: 'Dimensions should be an integer between [1, 10000]',
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
      placeholder: '[1, 10000]',
      validation: {
        validate: isBetween,
        params: { min: 1, max: 10000 },
        errorMsg: 'nList should be an integer between [1, 10000]',
      },
    },
    // segment size
    segmentSize: {
      value: SEGMENT_SIZE_OPTIONS[0].value,
      showError: false,
    },
    apacheType: 'pulsar',
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

  const hanldeRemovePromot = key => {
    if (!form[key].showError) {
      return;
    }
    setForm(v => ({
      ...v,
      [key]: {
        ...v[key],
        value: '',
        showError: false,
        helpText: '',
      },
    }));
  };

  const handleApacheChange = (e, value) => {
    setForm(v => ({
      ...v,
      apacheType: value,
    }));
  };

  const calcResult = useMemo(() => {
    const { nb, d, indexType, nlist, m, segmentSize } = form;

    const nbVal = Number(nb.value) * $1M || 0;
    const dVal = Number(d.value) || 0;
    const nlistVal = Number(nlist.value) || 0;
    const mVal = Number(m.value) || 0;
    const sVal = Number(segmentSize.value) || 0;

    const isErrorParameters = Object.values(form).some(
      v => v.showError || v.value === ''
    );

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
    const etcdData = etcdCalculator(rawFileSize);
    const minioData = minioCalculator(rawFileSize, theorySize);
    const pulsarData = pulsarCalculator(rawFileSize);
    const kafkaData = kafkaCalculator(rawFileSize);

    return {
      memorySize: unitBYTE2Any(memorySize),
      rawFileSize: unitBYTE2Any(rawFileSize),
      rootCoord,
      dataNode,
      indexNode,
      proxy,
      queryNode,
      commonCoord,
      etcdData,
      minioData,
      pulsarData,
      kafkaData,
    };
  }, [form]);

  const handleDownloadYmlFile = (content, fielName) => {
    if (typeof window !== 'undefined') {
      const blob = new Blob([content], {
        type: 'text/plain',
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${fielName}.yml`;
      a.click();
    }
  };

  const handleDownloadHelm = () => {
    const content = helmYmlGenerator(calcResult, form.apacheType);
    handleDownloadYmlFile(content, 'helmConfigYml');
  };

  const handleDownloadOperator = () => {
    const content = operatorYmlGenerator(calcResult, form.apacheType);
    handleDownloadYmlFile(content, 'operatorConfigYml');
  };
  const version = findLatestVersion(allVersion.nodes);

  return (
    <main className={classes.main}>
      <Seo
        lang={language}
        title={t('v3trans.sizingTool.title')}
        description=""
      />
      <Layout t={t} darkMode={false} version={version}>
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
                  <TextField
                    fullWidth
                    error={form.nb.showError}
                    label={t('v3trans.sizingTool.labels.vector')}
                    value={form.nb.value}
                    helperText={form.nb.helpText}
                    placeholder={form.nb.placeholder}
                    onFocus={() => hanldeRemovePromot('nb')}
                    onChange={e => {
                      handleFormValueChange(e.target.value, 'nb');
                    }}
                  />
                </div>

                <div className={classes.dataItem}>
                  <p className={classes.label}>
                    {t('v3trans.sizingTool.labels.dimension')}
                  </p>
                  <TextField
                    fullWidth
                    error={form.d.showError}
                    label={t('v3trans.sizingTool.labels.dimension')}
                    value={form.d.value}
                    helperText={form.d.helpText}
                    placeholder={form.d.placeholder}
                    onFocus={() => hanldeRemovePromot('d')}
                    onChange={e => {
                      handleFormValueChange(e.target.value, 'd');
                    }}
                  />
                </div>
              </div>

              <div className={classes.indexType}>
                <h3>{t('v3trans.sizingTool.labels.indexType')}</h3>

                <div className={classes.dataItem}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('v3trans.sizingTool.labels.index')}
                    </InputLabel>
                    <Select
                      value={form.indexType.value}
                      label={t('v3trans.sizingTool.labels.index')}
                      onChange={e => {
                        handleFormValueChange(e.target.value, 'indexType');
                      }}
                    >
                      {INDEX_TYPE_OPTIONS.map(v => (
                        <MenuItem value={v.value} key={v.value}>
                          {v.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                      <TextField
                        fullWidth
                        error={form.nlist.showError}
                        label="nlist"
                        value={form.nlist.value}
                        helperText={form.nlist.helpText}
                        placeholder={form.nlist.placeholder}
                        onFocus={() => hanldeRemovePromot('nlist')}
                        onChange={e => {
                          handleFormValueChange(e.target.value, 'nlist');
                        }}
                      />
                    </>
                  )}
                </div>

                <div className={classes.dataItem}>
                  <p className={classes.label}>
                    {t('v3trans.sizingTool.labels.segmentSize')}
                  </p>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('v3trans.sizingTool.labels.segment')}
                    </InputLabel>
                    <Select
                      value={form.segmentSize.value}
                      label={t('v3trans.sizingTool.labels.segment')}
                      onChange={d => {
                        handleFormValueChange(d.target.value, 'segmentSize');
                      }}
                    >
                      {SEGMENT_SIZE_OPTIONS.map(v => (
                        <MenuItem value={v.value} key={v.value}>
                          {v.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <RadioGroup
                      value={form.apacheType}
                      onChange={handleApacheChange}
                      className={classes.radioGroup}
                    >
                      <FormControlLabel
                        value="pulsar"
                        control={<Radio />}
                        label="Pulsar"
                      />
                      <FormControlLabel
                        value="kafka"
                        control={<Radio />}
                        label="Kafka"
                      />
                    </RadioGroup>
                  </FormControl>
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

                  {/* etcd */}
                </div>
                <div className={classes.line}>
                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.etcd.title')}
                    subTitle={`${calcResult.etcdData.cpu} core ${calcResult.etcdData.memory} GB`}
                    content={`x ${calcResult.etcdData.podNumber}`}
                    extraData={{
                      key: 'Pvc per pod',
                      value: `SSD ${calcResult.etcdData.pvcPerPodSize} GB`,
                    }}
                  />
                  {/* Minio */}
                  <SizingToolCard
                    title={t('v3trans.sizingTool.setups.minio.title')}
                    subTitle={`${calcResult.minioData.cpu} core ${calcResult.minioData.memory} GB`}
                    content={`x ${calcResult.minioData.podNumber}`}
                    extraData={{
                      key: 'Pvc per pod',
                      value: `${calcResult.minioData.pvcPerPodSize} ${calcResult.minioData.pvcPerPodUnit}B`,
                    }}
                  />
                </div>

                {/* pulsar or kafka */}
                <div className={classes.line}>
                  {form.apacheType === 'pulsar' ? (
                    <SizingConfigCard
                      title={t('v3trans.sizingTool.setups.pulsar.title')}
                      {...calcResult.pulsarData}
                    />
                  ) : (
                    <SizingConfigCard
                      title={t('v3trans.sizingTool.setups.kafka.title')}
                      {...calcResult.kafkaData}
                    />
                  )}
                </div>
              </div>

              <div className={classes.btnsWrapper}>
                <button
                  className={classes.downloadBtn}
                  onClick={handleDownloadHelm}
                >
                  <DownloadIcon />
                  <span>{t('v3trans.sizingTool.buttons.helm')}</span>
                </button>
                <button
                  className={classes.downloadBtn}
                  onClick={handleDownloadOperator}
                >
                  <DownloadIcon />
                  <span>{t('v3trans.sizingTool.buttons.operator')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </main>
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
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
  }
`;
