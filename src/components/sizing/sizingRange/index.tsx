import { useCallback, useMemo, useRef, useState } from 'react';
import { Range } from 'react-range';
import { scaleLinear } from 'd3-scale';
import clsx from 'clsx';
import classes from './index.module.css';
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
  placeholder?: string;
}

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const SLIDER_STEP = 1;

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
  const { root, label: labelClass } = customClasses;

  // domain: 0 - 100 along the slider track
  // range: real value the user cares about
  const toRangeValue = useMemo(
    () => scaleLinear().domain(rangeConfig.domain).range(rangeConfig.range),
    [rangeConfig]
  );
  const toDomainValue = useMemo(
    () => scaleLinear().domain(rangeConfig.range).range(rangeConfig.domain),
    [rangeConfig]
  );

  const clampRange = (v: number) => {
    if (v <= rangeConfig.min) return rangeConfig.min;
    if (v >= rangeConfig.max) return rangeConfig.max;
    return v;
  };

  const clampDomain = (v: number) => {
    if (v <= SLIDER_MIN) return SLIDER_MIN;
    if (v >= SLIDER_MAX) return SLIDER_MAX;
    return v;
  };

  const domainValue = clampDomain(toDomainValue(value));

  const [inputValue, setInputValue] = useState(`${value}`);

  // Ref to the inner track DOM element so we can compute click/drag positions.
  // react-range@1.10.0 has a broken `isIOS()` check that aborts onMouseDownTrack
  // for any browser where `'ontouchend' in document` is true (which includes
  // Chrome on macOS), so we drive the slider via our own pointer handlers.
  const trackInnerRef = useRef<HTMLDivElement | null>(null);

  const setTrackInnerRef = useCallback(
    (node: HTMLDivElement | null, libraryRef: React.Ref<HTMLDivElement>) => {
      trackInnerRef.current = node;
      if (typeof libraryRef === 'function') {
        libraryRef(node);
      } else if (libraryRef && typeof libraryRef === 'object') {
        (libraryRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      }
    },
    []
  );

  const updateFromClientX = (clientX: number) => {
    const el = trackInnerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    const newDomain = clampDomain(
      ratio * (SLIDER_MAX - SLIDER_MIN) + SLIDER_MIN
    );
    const rangeValue = clampRange(Math.floor(toRangeValue(newDomain)));
    setInputValue(`${rangeValue}`);
    onRangeChange(rangeValue);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    updateFromClientX(e.clientX);
  };

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // react-range still calls onChange via keyboard arrow keys on the focused
  // thumb, so we keep wiring it.
  const handleSliderChange = (values: number[]) => {
    const newDomain = values[0];
    const rangeValue = clampRange(Math.floor(toRangeValue(newDomain)));
    setInputValue(`${rangeValue}`);
    onRangeChange(rangeValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    let num = Number(raw);
    if (isNaN(num)) {
      return;
    }

    if (num > rangeConfig.max) {
      raw = `${rangeConfig.max}`;
      num = rangeConfig.max;
    }

    const clamped = clampRange(num);
    setInputValue(raw);
    onRangeChange(clamped);
  };

  const handleFormatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (isNaN(num)) {
      num = rangeConfig.min;
    }
    const clamped = clampRange(num);
    setInputValue(`${clamped}`);
    onRangeChange(clamped);
  };

  return (
    <div className={clsx(classes.rangeContainer, root)}>
      {label && <p className={clsx(classes.label, labelClass)}>{label}</p>}
      <div className={classes.rangeWrapper}>
        <div className={classes.sliderWrapper}>
          <Range
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            values={[domainValue]}
            onChange={handleSliderChange}
            renderTrack={({ props: trackProps, children }) => (
              <div
                className={classes.trackOuter}
                style={trackProps.style}
                onPointerDown={handleTrackPointerDown}
                onPointerMove={handleTrackPointerMove}
                onPointerUp={handleTrackPointerUp}
                onPointerCancel={handleTrackPointerUp}
              >
                <div
                  ref={node => setTrackInnerRef(node, trackProps.ref)}
                  className={classes.trackInner}
                >
                  <div
                    className={classes.trackFill}
                    style={{ width: `${domainValue}%` }}
                  />
                  {rangeConfig.domain.map((d, i) => (
                    <span
                      key={`mark-${i}`}
                      className={classes.mark}
                      style={{ left: `${d}%` }}
                      aria-hidden
                    />
                  ))}
                  {children}
                  {rangeConfig.domain.map((d, i) => (
                    <span
                      key={`label-${i}`}
                      className={classes.markLabel}
                      style={{ left: `${d}%` }}
                      aria-hidden
                    >
                      {rangeConfig.range[i]}
                    </span>
                  ))}
                </div>
              </div>
            )}
            renderThumb={({ props: thumbProps }) => {
              const { key, ...restThumbProps } = thumbProps as typeof thumbProps & {
                key?: React.Key;
              };
              return (
                <div
                  {...restThumbProps}
                  key={key}
                  className={classes.thumb}
                  aria-label="slider-thumb"
                />
              );
            }}
          />
        </div>
        <SizingInput
          value={inputValue}
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
