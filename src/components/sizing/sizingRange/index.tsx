import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import classes from './index.module.less';
import clsx from 'clsx';
import { scaleLinear, scalePow } from 'd3-scale';
import { SizingInput } from '../sizingInput';

type RangeConfigType = {
  min: number;
  max: number;
  defaultValue: number;
  range: number[];
  domain: number[];
};

interface SizingRangePropsType {
  rangeConfig: RangeConfigType;
  label?: React.ReactNode;
  classes?: {
    root?: string;
    label?: string;
  };
  value: number;
  onRangeChange: (value: number) => void;
  unit?: string;
}

export const SizingRange = (props: SizingRangePropsType) => {
  const {
    rangeConfig,
    label,
    classes: customClasses = {},
    onRangeChange,
    unit,
    value,
  } = props;
  const { root, label: labelCLass } = customClasses;

  // domain: 0 - 100 under progress
  // range: real value
  const getRangeValue = scaleLinear()
    .domain(rangeConfig.domain)
    .range(rangeConfig.range);

  const getDomainValue = scaleLinear()
    .domain(rangeConfig.range)
    .range(rangeConfig.domain);

  const marks = rangeConfig.domain.map((item, index) => {
    return {
      value: item,
      label: rangeConfig.range[index],
    };
  });

  function valuetext(value: number) {
    return `${value}`;
  }

  const handleRangeChange = (newValue: number | number[]) => {
    const domainValue = Math.round(getRangeValue(newValue));
    onRangeChange(domainValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const realValue = Number(e.target.value);
    handleRangeChange(realValue);
  };

  return (
    <div className={clsx(classes.rangeContainer, root)}>
      {label && <p className={clsx(classes.label, labelCLass)}>{label}</p>}
      <div className={classes.rangeWrapper}>
        <Slider
          track="normal"
          aria-labelledby="track-false-slider"
          getAriaValueText={valuetext}
          defaultValue={getDomainValue(rangeConfig.defaultValue)}
          value={getDomainValue(value)}
          marks={marks}
          onChange={(e, newVal) => {
            handleRangeChange(newVal);
          }}
          classes={{
            markLabel: classes.customMarkLabel,
            markLabelActive: classes.customMarkLabel,
            mark: classes.customMark,
            markActive: classes.customMark,
            rail: classes.customRail,
            track: classes.customTrack,
            thumb: classes.customThumb,
          }}
        />
        <SizingInput
          value={value}
          unit={unit}
          onChange={handleInputChange}
          customSize="small"
        />
      </div>
    </div>
  );
};
