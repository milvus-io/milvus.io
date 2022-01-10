import React, { useEffect, useMemo, useState, useRef } from "react";
import clsx from "clsx";
import { useIntervalWhen } from "rooks";
import Typography from "@mui/material/Typography";

const Attu = props => {
  const { t = v => v } = props;

  const [when, setWhen] = useState(true);
  const [activeExample, setActivExample] = useState(0);
  const timeid = useRef(0);

  const incremental = () => {
    let el = activeExample + 1;
    if (el > 2) {
      el = 0;
    }
    setActivExample(el);
  };

  useIntervalWhen(
    () => {
      incremental();
    },
    5000,
    when,
    true
  );

  const handleActiveClick = active => {
    if (timeid.current) {
      clearTimeout(timeid.current);
    }
    setWhen(false);
    setActivExample(active);

    timeid.current = setTimeout(() => {
      setWhen(true);
      timeid.current = 0;
    }, 5000);
  };

  return (
    <>
      <div className="attu-desc col-12 col-8 col-4">
        <Typography component="h2" variant="h2">
          {t("v3trans.home.attu.title")}
        </Typography>
        <Typography component="p" variant="h5">
          {t("v3trans.home.attu.desc")}
        </Typography>
      </div>
      <section className="section3 col-12 col-8 col-4 attu-section">
        <div className="example-wrapper">
          <div className="milvus-feature attu-feature">
            <div className="shooting_star_container manage-shooting">
              <div
                className={clsx({
                  shooting_star: activeExample === 0,
                })}
              ></div>
            </div>
            <div className="shooting_star_container search-shooting">
              <div
                className={clsx({
                  shooting_star: activeExample === 1,
                })}
              ></div>
            </div>
            <div className="shooting_star_container index-shooting">
              <div
                className={clsx({
                  shooting_star: activeExample === 2,
                })}
              ></div>
            </div>
            <Typography component="h3" variant="h3" className="left-title">
              {t("v3trans.home.attu.sub-title")} <span>Attu</span>
            </Typography>
            <p
              className={clsx("left-li", { active: activeExample === 0 })}
              role="button"
              onClick={() => handleActiveClick(0)}
            >
              {t("v3trans.home.attu.statistics")}
            </p>
            <p
              className={clsx("left-li", { active: activeExample === 1 })}
              role="button"
              onClick={() => handleActiveClick(1)}
            >
              {t("v3trans.home.attu.manage")}
            </p>
            <p
              className={clsx("left-li", { active: activeExample === 2 })}
              role="button"
              onClick={() => handleActiveClick(2)}
            >
              {t("v3trans.home.attu.operation")}
            </p>
            <div className="btn-groups">
              <button className={`primaryBtnSm`}>
                {t("v3trans.home.attu.download")}
              </button>
              <button className={`secondaryBtnSm`}>
                {t("v3trans.home.attu.learn")}
              </button>
            </div>
          </div>

          <div
            className={clsx("attu-example", {
              [`attu-example-0`]: activeExample === 0,
              [`attu-example-1`]: activeExample === 1,
              [`attu-example-2`]: activeExample === 2,
            })}
          >
            {/* insert images here*/}
          </div>
        </div>
      </section>
    </>
  );
};

export default Attu;
