import styles from './index.module.less';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState, useMemo, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useWindowSize } from '../../http/hooks';

export default function FlexibleSection(props) {
  const { classes = {}, minWidth, maxWidth } = props;

  const { root = '' } = classes;

  // use for development
  const windowSize = useWindowSize();

  // use for production
  let isDesktop = true;
  if (typeof navigator !== 'undefined') {
    isDesktop =
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent
      );
  }

  const [barStatus, setBarStatus] = useState({
    // expand or collapse triggered by click button
    trueExpanded: true,
    // expand or collapse triggered by mouse enter or leave
    fakeExpanded: false,
    // float, won't take context space
    isFloat: false,
  });

  const iconBtn = useRef(null);

  // click event handler
  const handleToggleExpanded = () => {
    const { trueExpanded } = barStatus;
    // if (isDesktop) {
    //   setBarStatus({
    //     trueExpanded: !trueExpanded,
    //     fakeExpanded: false,
    //     isFloat: false,
    //   });
    // } else {
    //   console.log(1111111);
    //   setBarStatus({
    //     trueExpanded: !trueExpanded,
    //     fakeExpanded: false,
    //     isFloat: true,
    //   });
    // }
    if (windowSize !== 'phone' && windowSize !== 'tablet') {
      setBarStatus({
        trueExpanded: !trueExpanded,
        fakeExpanded: false,
        isFloat: false,
      });
    } else {
      setBarStatus({
        trueExpanded: !trueExpanded,
        fakeExpanded: false,
        isFloat: true,
      });
    }
  };

  // mouse event handler
  const handleToggleTempExpanded = (e, boolean) => {
    const { trueExpanded } = barStatus;
    if (
      trueExpanded ||
      e.target === iconBtn.current ||
      iconBtn.current.contains(e.target)
    ) {
      return;
    }
    setBarStatus({
      trueExpanded: false,
      fakeExpanded: boolean,
      isFloat: true,
    });
  };

  const contentStyle = useMemo(() => {
    const { trueExpanded, fakeExpanded, isFloat } = barStatus;

    return {
      position: isFloat ? 'absolute' : 'static',
      width: trueExpanded || fakeExpanded ? maxWidth : minWidth,
    };
  }, [barStatus]);

  // useEffect(() => {
  //   if (!isDesktop) {
  //     setBarStatus({
  //       trueExpanded: false,
  //       fakeExpanded: false,
  //       isFloat: false,
  //     });
  //   } else {
  //     setBarStatus({
  //       trueExpanded: true,
  //       fakeExpanded: false,
  //       isFloat: false,
  //     });
  //   }
  // }, [isDesktop]);

  useEffect(() => {
    if (windowSize === 'phone' || windowSize === 'tablet') {
      setBarStatus(v => ({
        ...v,
        trueExpanded: false,
      }));
    } else {
      setBarStatus(v => ({
        ...v,
        trueExpanded: true,
      }));
    }
  }, [windowSize]);

  return (
    <div
      className={clsx(styles.flexibleSectionWrapper, {
        [root]: root,
      })}
    >
      <div
        style={contentStyle}
        className={styles.flexibleSection}
        onMouseEnter={e => handleToggleTempExpanded(e, true)}
        onMouseLeave={e => handleToggleTempExpanded(e, false)}
      >
        <div
          className={clsx(styles.contentWrapper, {
            [styles.hiddenContent]:
              !barStatus.trueExpanded && !barStatus.fakeExpanded,
          })}
        >
          {props.children}
        </div>
        {/* width 12px */}
        <div className={styles.buttonWrapper}>
          {/* width 24px, half overflow, float */}
          <div className={styles.floatBtn}>
            {/* width 24px */}
            <button
              className={clsx(styles.controller, {
                [styles.expandIcon]: !barStatus.trueExpanded,
              })}
              onClick={handleToggleExpanded}
              ref={iconBtn}
            >
              <KeyboardArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
