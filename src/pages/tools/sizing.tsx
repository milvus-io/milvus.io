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
import CustomButton from '@/components/customButton';

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
  mixCoordCalculator,
  unitAny2BYTE,
} from '@/utils/sizingTool';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import HighlightBlock from '@/components/card/sizingToolCard/codeBlock';
import {
  HELM_CONFIG_FILE_NAME,
  OPERATOR_CONFIG_FILE_NAME,
  REQUIRE_MORE,
  INDEX_TYPE_OPTIONS,
  SEGMENT_SIZE_OPTIONS,
  IndexTypeEnum,
} from '@/components/card/sizingToolCard/constants';
import { ABSOLUTE_BASE_URL } from '@/consts';
import FormSection from '@/parts/sizing/formSection';
import ResultSection from '@/parts/sizing/resultSection';

export default function SizingTool() {
  const { t } = useTranslation('sizingTool');

  return (
    <main className={classes.pageContainer}>
      <Layout darkMode={false}>
        <Head>
          <title>
            Milvus Sizing Tool · Vector Database built for scalable similarity
            search
          </title>
          <meta name="description" content="Sizing tool" />
          <link
            rel="alternate"
            href={`${ABSOLUTE_BASE_URL}/tools/sizing`}
            hrefLang="en"
          />
        </Head>

        <div
          className={clsx(pageClasses.container, classes.sizingToolContainer)}
        >
          <h1 className={classes.title}>Milvus Sizing Tool</h1>
          <p className={classes.desc}>
            Note: all the recommendations are calculated based on our lab data,
            you should adjust it with your own testing before deploying to
            production. If you have any question, please contact us.
          </p>
          <div className={classes.contentContainer}>
            <FormSection className={classes.leftSection} />
            <ResultSection className={classes.rightSection} />
          </div>
        </div>
      </Layout>
    </main>
  );
}
