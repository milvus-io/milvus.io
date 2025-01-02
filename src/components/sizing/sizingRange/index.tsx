import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import classes from './index.module.less';
import clsx from 'clsx';
import { scaleLinear, scalePow } from 'd3-scale';
import { SizingInput } from '../sizingInput';
import { init } from 'next/dist/compiled/webpack/webpack';

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
  placeholder?: string;
}

export const SizingRange = (props: SizingRangePropsType) => {
  const {
    rangeConfig,
    label,
    classes: customClasses = {},
    onRangeChange,
    unit,
    value,
    placeholder,
  } = props;
  const { root, label: labelCLass } = customClasses;

  // domain: 0 - 100 under progress
  // range: real value
  const getRangeValue = (value: number) => {
    const rangeScale = scaleLinear()
      .domain(rangeConfig.domain)
      .range(rangeConfig.range);

    const rangeValue = Math.floor(rangeScale(value));

    if (rangeValue <= rangeConfig.min) {
      return rangeConfig.min;
    }
    if (rangeValue >= rangeConfig.max) {
      return rangeConfig.max;
    }
    return rangeValue;
  };

  const getDomainValue = (value: number) => {
    const domainScale = scaleLinear()
      .domain(rangeConfig.range)
      .range(rangeConfig.domain);

    const domainValue = domainScale(value);
    if (domainValue <= 0) {
      return 0;
    }
    if (domainValue >= 100) {
      return 100;
    }
    return domainValue;
  };

  const [initValue, setInitValue] = useState({
    rangeValue: value,
    domainValue: getDomainValue(value),
    inputValue: `${value}`,
  });

  const marks = rangeConfig.domain.map((item, index) => {
    return {
      value: item,
      label: rangeConfig.range[index],
    };
  });

  function valuetext(value: number) {
    return `${value}`;
  }

  // props is domain value; [0,100]
  const handleRangeChange = (newValue: number | number[]) => {
    const rangeValue = getRangeValue(newValue as number);
    setInitValue({
      rangeValue: rangeValue,
      domainValue: newValue,
      inputValue: `${rangeValue}`,
    });
    onRangeChange(rangeValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let value = Number(inputValue); // range value
    if (isNaN(value)) {
      return;
    }

    value =
      value <= rangeConfig.min
        ? rangeConfig.min
        : value >= rangeConfig.max
        ? rangeConfig.max
        : value;

    const domainValue = getDomainValue(value);

    setInitValue({
      rangeValue: value,
      domainValue,
      inputValue,
    });
    onRangeChange(value);
  };

  const handleFormatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let value = Number(inputValue); // range value

    value =
      value <= rangeConfig.min
        ? rangeConfig.min
        : value >= rangeConfig.max
        ? rangeConfig.max
        : value;

    const domainValue = getDomainValue(value);
    console.log(value);

    setInitValue({
      rangeValue: value,
      domainValue,
      inputValue: `${value}`,
    });
    onRangeChange(value);
  };

  return (
    <div className={clsx(classes.rangeContainer, root)}>
      {label && <p className={clsx(classes.label, labelCLass)}>{label}</p>}
      <div className={classes.rangeWrapper}>
        <Slider
          track="normal"
          aria-labelledby="track-false-slider"
          getAriaValueText={valuetext}
          value={initValue.domainValue}
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
            root: classes.customRangeRoot,
          }}
        />
        <SizingInput
          value={initValue.inputValue}
          unit={unit}
          onChange={handleInputChange}
          onBlur={handleFormatInput}
          customSize="small"
          placeholder={placeholder}
          classes={{ root: classes.inputWrapper }}
        />
      </div>
    </div>
  );
};
