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
  unitAny2BYTE,
  unitBYTE2Any,
  indexNodeCalculator,
  queryNodeCalculator,
  isBetween,
  rootCoordCalculator,
  dataNodeCalculator,
  proxyCalculator,
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

// collection shard, default value = 2;
const SHARD = 2;

// one million
const $1M = Math.pow(10, 6);
/// one billion
const $1B = Math.pow(10, 9);

const defaultSizeContent = {
  size: 'Require more data',
  amount: 0,
};

export default function SizingTool() {
  const { language, t } = useI18next();

  const [form, setForm] = useState({
    // number of vectors
    nb: {
      value: $1M,
      showError: false,
      helpText: '',
      placeholder: `[${$1M} - ${10 * $1B}]`,
      validation: {
        validate: isBetween,
        params: { min: $1M, max: $1B },
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

  const handleDownloadYamlFile = () => {};

  const openArrow = <span className={classes.arrowIcon}></span>;

  const indexTypeValue = useMemo(() => {
    if (form.indexType.value === 'HNSW') {
      return 'HNSW';
    }
    if (form.indexType.value === 'FLAT') {
      return 'FLAT';
    }
    return 'IVF';
  }, [form.indexType]);

  const calcResult = useMemo(() => {
    const { nb, d, indexType, nlist, m, segmentSize } = form;

    const nbVal = Number(nb.value) || 0;
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
      };
    }

    const memorySize = memorySizeCalculator({
      nb: nbVal,
      d: dVal,
      nlist: nlistVal,
      M: mVal,
      indexType: indexType.value,
    });

    const rawFileSize = rawFileSizeCalculator({ d: dVal, nb: nbVal });

    const rootCoord = rootCoordCalculator(nbVal);

    const dataNode = dataNodeCalculator(nbVal);

    const indexNode = indexNodeCalculator(memorySize, sVal);

    const proxy = proxyCalculator(memorySize);

    const queryNode = queryNodeCalculator(memorySize);

    return {
      memorySize: unitBYTE2Any(memorySize),
      rawFileSize: unitBYTE2Any(rawFileSize),
      rootCoord,
      dataNode,
      indexNode,
      proxy,
      queryNode,
    };
  }, [form]);

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
                  <div>
                    <TextField
                      fullWidth
                      error={form.nb.showError}
                      label="Number of vectors"
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
                  <p className={classes.label}>Dimensions</p>
                  <div>
                    <TextField
                      fullWidth
                      error={form.d.showError}
                      label="Dimensions"
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
                <h3>Choose index type</h3>
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

                {indexTypeValue === 'FLAT' && (
                  <div className={classes.dataItem}>
                    <p className={clsx(classes.label, classes.shortMargin)}>
                      Choose index parameters
                    </p>
                    {indexTypeValue === 'IVF' && (
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
                    )}
                    {indexTypeValue === 'HNSW' && (
                      <>
                        <p className={classes.interpretation}>
                          M (Maximum degree of the node)
                        </p>
                        <div className={classes.sliderWrapper}>
                          <Slider
                            value={form.m.value}
                            step={2}
                            min={4}
                            max={64}
                            valueLabelDisplay="auto"
                            onChange={e => {
                              handleFormValueChange(e.target.value, 'm');
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className={classes.dataItem}>
                  <p className={clsx(classes.label, classes.shortMargin)}>
                    Choose segment size
                  </p>
                  <p className={classes.interpretation}>Segment (MB)</p>
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
                <h3>Approximate capacity</h3>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title="Memory"
                    content={`${calcResult.memorySize.size} ${calcResult.memorySize.unit}`}
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                  <SizingToolCard
                    title="Raw file size"
                    content={`${calcResult.rawFileSize.size} ${calcResult.rawFileSize.unit}`}
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
                    subTitle={calcResult.rootCoord.size}
                    content={calcResult.rootCoord.amount}
                    showTooltip
                    tooltip="Root coord handles data definition language (DDL) and data control language (DCL) requests, such as create or delete collections, partitions, or indexes, as well as manage TSO (timestamp Oracle) and time ticker issuing."
                  />

                  <SizingToolCard
                    title="Proxy"
                    subTitle={calcResult.proxy.size}
                    content={calcResult.proxy.amount}
                    showTooltip
                    tooltip="Proxy is the access layer of the system and endpoint to users. It validates client requests and reduces the returned results."
                  />

                  <SizingToolCard
                    title="Index Type"
                    content={form.indexType.value}
                  />

                  <SizingToolCard
                    title="Query Node"
                    subTitle={calcResult.queryNode.size}
                    content={calcResult.queryNode.amount}
                    showTooltip
                    tooltip="Query node retrieves incremental log data and turn them into growing segments by subscribing to the log broker, loads historical data from the object storage, and runs hybrid search between vector and scalar data."
                  />

                  <SizingToolCard
                    title="Data Node"
                    subTitle={calcResult.dataNode.size}
                    content={calcResult.dataNode.amount}
                    showTooltip
                    tooltip="Data node retrieves incremental log data by subscribing to the log broker, processes mutation requests, and packs log data into log snapshots and stores them in the object storage."
                  />

                  <SizingToolCard
                    title="Index Node"
                    subTitle={calcResult.indexNode.size}
                    content={calcResult.indexNode.amount}
                    showTooltip
                    tooltip="Index node builds indexes. Index nodes do not need to be memory resident, and can be implemented with the serverless framework."
                  />
                </div>
              </div>

              <button
                className={classes.downloadBtn}
                onClick={handleDownloadYamlFile}
              >
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
