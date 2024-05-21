import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/sizingTool.module.less';
import pageClasses from '@/styles/responsive.module.less';
import { InfoFilled, DownloadIcon } from '@/components/icons';
import SizingToolCard from '@/components/card/sizingToolCard';
import SizingConfigCard from '@/components/card/sizingToolCard/sizingConfigCard';
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
import Head from 'next/head';

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
} from '@/utils/sizingTool';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import HighlightBlock from '@/components/card/sizingToolCard/codeBlock';
import {
  HELM_CONFIG_FILE_NAME,
  OPERATOR_CONFIG_FILE_NAME,
  REQUIRE_MORE,
  INDEX_TYPE_OPTIONS,
  SEGMENT_SIZE_OPTIONS,
} from '@/components/card/sizingToolCard/constants';

// one million
const $1M = Math.pow(10, 6);

const defaultSizeContent = {
  size: REQUIRE_MORE,
  cpu: 0,
  memory: 0,
  amount: 0,
};

export default function SizingTool() {
  const { t } = useTranslation('sizingTool');

  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    handleClose: () => {},
    children: <></>,
  });
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
      const etcdData = etcdCalculator();
      const minioData = minioCalculator();
      const pulsarData = pulsarCalculator();
      const kafkaData = kafkaCalculator();
      return {
        memorySize: { size: 0, unit: 'B' },
        rawFileSize: { size: 0, unit: 'B' },
        rootCoord: defaultSizeContent,
        dataNode: defaultSizeContent,
        indexNode: defaultSizeContent,
        proxy: defaultSizeContent,
        queryNode: defaultSizeContent,
        commonCoord: defaultSizeContent,
        etcdData,
        minioData,
        pulsarData,
        kafkaData,
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
  const { milvusData, dependencyData, totalData } = useMemo(() => {
    const calculateList = [
      calcResult.rootCoord,
      calcResult.commonCoord,
      calcResult.commonCoord,
      calcResult.proxy,
      calcResult.queryNode,
      calcResult.dataNode,
      calcResult.indexNode,
    ];

    const milvusData = {
      core: calculateList.reduce((acc, cur) => {
        acc += cur.cpu * cur.amount;
        return acc;
      }, 0),
      memory: calculateList.reduce((acc, cur) => {
        acc += cur.memory * cur.amount;
        return acc;
      }, 0),
    };

    const secondPartData = {
      core:
        calcResult.etcdData.cpu * calcResult.etcdData.podNumber +
        calcResult.minioData.cpu * calcResult.minioData.podNumber,
      memory:
        calcResult.etcdData.memory * calcResult.etcdData.podNumber +
        calcResult.minioData.memory * calcResult.minioData.podNumber,
      ssd:
        calcResult.etcdData.pvcPerPodUnit === 'G'
          ? calcResult.etcdData.pvcPerPodSize * calcResult.etcdData.podNumber
          : (calcResult.etcdData.pvcPerPodSize *
              calcResult.etcdData.podNumber) /
            1024,
      disk:
        calcResult.minioData.pvcPerPodUnit === 'G'
          ? calcResult.minioData.pvcPerPodSize * calcResult.minioData.podNumber
          : (calcResult.minioData.pvcPerPodSize *
              calcResult.minioData.podNumber) /
            1024,
    };

    const pulsarBookieData =
      calcResult.pulsarData.bookie.ledgers.unit === 'G'
        ? calcResult.pulsarData.bookie.ledgers.size *
          calcResult.pulsarData.bookie.podNum.value
        : (calcResult.pulsarData.bookie.ledgers.size *
            calcResult.pulsarData.bookie.podNum.value) /
          1024;
    const pulsarZookeeperData =
      calcResult.pulsarData.zookeeper.pvc.unit === 'G'
        ? calcResult.pulsarData.zookeeper.pvc.size *
          calcResult.pulsarData.zookeeper.podNum.value
        : (calcResult.pulsarData.zookeeper.pvc.size *
            calcResult.pulsarData.zookeeper.podNum.value) /
          1024;
    const pulsarData = {
      core: Object.values(calcResult.pulsarData).reduce((acc, cur) => {
        acc += cur.cpu.size * cur.podNum.value;
        return acc;
      }, 0),
      memory: Object.values(calcResult.pulsarData).reduce((acc, cur) => {
        acc += cur.memory.size * cur.podNum.value;
        return acc;
      }, 0),
      ssd: pulsarBookieData + pulsarZookeeperData,
      disk:
        calcResult.pulsarData.bookie.journal.unit === 'G'
          ? calcResult.pulsarData.bookie.journal.size *
            calcResult.pulsarData.bookie.podNum.value
          : (calcResult.pulsarData.bookie.journal.size *
              calcResult.pulsarData.bookie.podNum.value) /
            1024,
    };

    const kafkaData = {
      core: Object.values(calcResult.kafkaData).reduce((acc, cur) => {
        acc += cur.cpu.size * cur.podNum.value;
        return acc;
      }, 0),
      memory: Object.values(calcResult.kafkaData).reduce((acc, cur) => {
        acc += cur.memory.size * cur.podNum.value;
        return acc;
      }, 0),
      ssd: Object.values(calcResult.kafkaData).reduce((acc, cur) => {
        if (cur.pvc?.isSSD) {
          if (cur.pvc.unit === 'G') {
            acc += cur.pvc.size * cur.podNum.value;
          } else {
            acc += (cur.pvc.size * cur.podNum.value) / 1024;
          }
        }
        return acc;
      }, 0),
      disk: Object.values(calcResult.kafkaData).reduce((acc, cur) => {
        if (!cur.pvc?.isSSD) {
          if (cur.pvc.unit === 'G') {
            acc += cur.pvc.size * cur.podNum.value;
          } else {
            acc += (cur.pvc.size * cur.podNum.value) / 1024;
          }
        }
        return acc;
      }, 0),
    };

    const thirdPartData = form.apacheType === 'pulsar' ? pulsarData : kafkaData;

    const totalData = {
      core: milvusData.core + secondPartData.core + thirdPartData.core,
      memory: milvusData.memory + secondPartData.memory + thirdPartData.memory,
      ssd: Math.ceil(secondPartData.ssd + thirdPartData.ssd),
      disk: Math.ceil(secondPartData.disk + thirdPartData.disk),
    };

    const dependencyData = {
      core: secondPartData.core + thirdPartData.core,
      memory: secondPartData.memory + thirdPartData.memory,
      ssd: Math.ceil(secondPartData.ssd + thirdPartData.ssd),
      disk: Math.ceil(secondPartData.disk + thirdPartData.disk),
    };

    return {
      milvusData,
      dependencyData,
      totalData,
    };
  }, [calcResult, form.apacheType]);

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
    handleDownloadYmlFile(content, HELM_CONFIG_FILE_NAME);
  };
  const handleDownloadOperator = () => {
    const content = operatorYmlGenerator(calcResult, form.apacheType);
    handleDownloadYmlFile(content, OPERATOR_CONFIG_FILE_NAME);
  };

  const handleCloseDialog = () => {
    setDialogState(v => ({
      ...v,
      open: false,
    }));
  };

  const handleOpenInstallGuide = type => {
    const title = type === 'helm' ? t('buttons.helm') : t('buttons.operator');

    setDialogState({
      open: true,
      title,
      handleClose: handleCloseDialog,
      children: <HighlightBlock type={type} />,
    });
  };

  return (
    <main className={classes.pageContainer}>
      <Layout darkMode={false}>
        <Head>
          <title>
            Milvus Sizing Tool · Vector Database built for scalable similarity
            search
          </title>
          <meta name="description" content="Sizing tool" />
        </Head>
        <div className={clsx(pageClasses.container, classes.container)}>
          <h1>{t('title')}</h1>
          <section className={classes.note}>
            <span className={classes.iconWrapper}>
              <InfoFilled />
            </span>
            <h2>{t('subTitle')}</h2>
          </section>
          <div className={classes.contentWrapper}>
            <section className={classes.leftPart}>
              <div className={classes.dataSize}>
                <h3>{t('labels.dataSize')}</h3>

                <div className={classes.dataItem}>
                  <p className={classes.label}>{t('labels.vector')}</p>
                  <TextField
                    fullWidth
                    error={form.nb.showError}
                    label={t('labels.vector')}
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
                  <p className={classes.label}>{t('labels.dimension')}</p>
                  <TextField
                    fullWidth
                    error={form.d.showError}
                    label={t('labels.dimension')}
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
                <h3>{t('labels.indexType')}</h3>

                <div className={classes.dataItem}>
                  <FormControl fullWidth>
                    <InputLabel>{t('labels.index')}</InputLabel>
                    <Select
                      value={form.indexType.value}
                      label={t('labels.index')}
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
                        {t('labels.indexParam')}
                      </p>
                      <p
                        className={clsx(
                          classes.interpretation,
                          classes.largeMargin
                        )}
                      >
                        {t('labels.m')}
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
                      <p className={classes.interpretation}>{t('labels.m')}</p>
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
                  <p className={classes.label}>{t('labels.segmentSize')}</p>
                  <FormControl fullWidth>
                    <InputLabel>{t('labels.segment')}</InputLabel>
                    <Select
                      value={form.segmentSize.value}
                      label={t('labels.segment')}
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
            </section>
            <section className={classes.rightPart}>
              <div className={classes.capacity}>
                <h3>{t('capacity')}</h3>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title={t('memory')}
                    content={`${calcResult.memorySize.size} ${calcResult.memorySize.unit}`}
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                  <SizingToolCard
                    title={t('fileSize')}
                    content={`${calcResult.rawFileSize.size} ${calcResult.rawFileSize.unit}`}
                    classes={{
                      contentClassName: classes.contentClassName,
                    }}
                  />
                </div>
              </div>

              <div className={classes.cluster}>
                <h3>{t('setups.title')}</h3>

                <div className={classes.singleRowCard}>
                  <div className={classes.totalWrapper}>
                    <div className={classes.singlePart}>
                      <p className={classes.label}>Total</p>
                      <p
                        className={classes.value}
                      >{`${totalData.core}core${totalData.memory}GB`}</p>
                    </div>
                  </div>
                  <div className={classes.totalWrapper}>
                    <div className={classes.singlePart}>
                      <p className={classes.label}>SSD</p>
                      <p className={classes.value}>{totalData.ssd}GB</p>
                    </div>
                    <div className={classes.singlePart}>
                      <p className={classes.label}>Disk</p>
                      <p className={classes.value}>{totalData.disk}GB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.cluster}>
                <div className={classes.titleRow}>
                  <h3 className={classes.title}>{t('milvus')}</h3>
                  <div className={classes.detailWrapper}>
                    <div className={classes.detailInfo}>
                      <p className={classes.label}>{t('total')}:&nbsp;</p>
                      <p className={classes.value}>
                        {t('coreInfo', {
                          core: milvusData.core,
                          memory: milvusData.memory,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={classes.cardsWrapper}>
                  <SizingToolCard
                    title={t('setups.proxy.title')}
                    tooltip={t('setups.proxy.tooltip')}
                    subTitle={calcResult.proxy.size}
                    content={calcResult.proxy.amount}
                    showTooltip
                  />
                  <SizingToolCard
                    title={t('setups.rootCoord.title')}
                    subTitle={calcResult.rootCoord.size}
                    content={calcResult.rootCoord.amount}
                    showTooltip
                    tooltip={t('setups.rootCoord.tooltip')}
                  />

                  <SizingToolCard
                    title={t('setups.dataCoord.title')}
                    tooltip={t('setups.dataCoord.tooltip')}
                    showTooltip
                    subTitle={calcResult.commonCoord.size}
                    content={calcResult.commonCoord.amount}
                  />
                  <SizingToolCard
                    title={t('setups.queryCoord.title')}
                    tooltip={t('setups.queryCoord.tooltip')}
                    showTooltip
                    subTitle={calcResult.commonCoord.size}
                    content={calcResult.commonCoord.amount}
                  />

                  <SizingToolCard
                    title={t('setups.dataNode.title')}
                    tooltip={t('setups.dataNode.tooltip')}
                    subTitle={calcResult.dataNode.size}
                    content={calcResult.dataNode.amount}
                    showTooltip
                  />

                  <SizingToolCard
                    title={t('setups.indexNode.title')}
                    tooltip={t('setups.indexNode.tooltip')}
                    subTitle={calcResult.indexNode.size}
                    content={calcResult.indexNode.amount}
                    showTooltip
                  />

                  <SizingToolCard
                    title={t('setups.queryNode.title')}
                    tooltip={t('setups.queryNode.tooltip')}
                    subTitle={calcResult.queryNode.size}
                    content={calcResult.queryNode.amount}
                    showTooltip
                  />
                </div>
              </div>
              <div className={classes.cluster}>
                <div className={classes.titleRow}>
                  <h3 className={classes.title}>{t('dependency')}</h3>
                  <div className={classes.detailWrapper}>
                    <div className={classes.detailInfo}>
                      <p className={classes.label}>{t('total')}:&nbsp;</p>
                      <p className={classes.value}>
                        {t('coreInfo', {
                          core: dependencyData.core,
                          memory: dependencyData.memory,
                        })}
                      </p>
                    </div>
                    <div className={classes.detailInfo}>
                      <p className={classes.label}>{t('ssd')}:&nbsp;</p>
                      <p className={classes.value}>
                        {t('sizeInfo', { size: dependencyData.ssd })}
                      </p>
                    </div>
                    <div className={classes.detailInfo}>
                      <p className={classes.label}>{t('disk')}:&nbsp;</p>
                      <p className={classes.value}>
                        {t('sizeInfo', { size: dependencyData.disk })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={classes.line}>
                  <SizingToolCard
                    title={t('setups.etcd.title')}
                    subTitle={
                      calcResult.etcdData.isError
                        ? REQUIRE_MORE
                        : `${calcResult.etcdData.cpu} core ${calcResult.etcdData.memory} GB`
                    }
                    content={`x ${
                      calcResult.etcdData.isError
                        ? 0
                        : calcResult.etcdData.podNumber
                    }`}
                    extraData={
                      calcResult.etcdData.isError
                        ? null
                        : {
                            key: 'Pvc per pod',
                            value: `SSD ${calcResult.etcdData.pvcPerPodSize} GB`,
                          }
                    }
                  />
                  {/* Minio */}
                  <SizingToolCard
                    title={t('setups.minio.title')}
                    subTitle={
                      calcResult.minioData.isError
                        ? REQUIRE_MORE
                        : `${calcResult.minioData.cpu} core ${calcResult.minioData.memory} GB`
                    }
                    content={`x ${
                      calcResult.minioData.isError
                        ? 0
                        : calcResult.minioData.podNumber
                    }`}
                    extraData={
                      calcResult.minioData.isError
                        ? null
                        : {
                            key: 'Pvc per pod',
                            value: `${calcResult.minioData.pvcPerPodSize} ${calcResult.minioData.pvcPerPodUnit}B`,
                          }
                    }
                  />
                </div>

                {/* pulsar or kafka */}
                <div className={classes.line}>
                  {form.apacheType === 'pulsar' ? (
                    <SizingConfigCard
                      title={t('setups.pulsar.title')}
                      {...calcResult.pulsarData}
                    />
                  ) : (
                    <SizingConfigCard
                      title={t('setups.kafka.title')}
                      {...calcResult.kafkaData}
                    />
                  )}
                </div>
              </div>

              <div className={classes.btnContainer}>
                <div className={classes.btnsWrapper}>
                  <button
                    className={classes.downloadBtn}
                    onClick={handleDownloadHelm}
                  >
                    <DownloadIcon />
                    <span>{t('buttons.helm')}</span>
                  </button>
                  <button
                    className={classes.guideLink}
                    onClick={() => handleOpenInstallGuide('helm')}
                  >
                    {t('buttons.guide')}
                  </button>
                </div>
                <div className={classes.btnsWrapper}>
                  <button
                    className={classes.downloadBtn}
                    onClick={handleDownloadOperator}
                  >
                    <DownloadIcon />
                    <span>{t('buttons.operator')}</span>
                  </button>
                  <button
                    className={classes.guideLink}
                    onClick={() => handleOpenInstallGuide('operator')}
                  >
                    {t('buttons.guide')}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Layout>
      <CustomizedContentDialogs {...dialogState} />
    </main>
  );
}
