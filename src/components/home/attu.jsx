import React, { useState, useRef } from "react";
import clsx from "clsx";
import { useIntervalWhen } from "rooks";
import Typography from "@mui/material/Typography";
import CustomIconLink from "../customIconLink";
import { Link } from "gatsby-plugin-react-i18next";

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
          {t("v3trans.home.attu.title")} with{" "}
          <span style={{ color: "#4fc4f9" }}>Attu</span>
        </Typography>
        <Typography component="p" classes={{ root: "subtitle" }}>
          {t("v3trans.home.attu.desc")}
        </Typography>
      </div>
      <section className="section3 col-12 col-8 col-4 attu-section">
        <div className="example-wrapper">
          <div className="milvus-feature attu-feature">
            <div
              className={clsx("shooting-title", {
                active: activeExample === 0,
              })}
              role="button"
              onClick={() => handleActiveClick(0)}
              onKeyDown={() => handleActiveClick(0)}
              tabIndex={0}
            >
              {t("v3trans.home.attu.statistics")}
              <span className="horizontal_shooting_star" />
            </div>
            <div
              className={clsx("shooting-title", {
                active: activeExample === 1,
              })}
              role="button"
              onClick={() => handleActiveClick(1)}
              onKeyDown={() => handleActiveClick(1)}
              tabIndex={0}
            >
              {t("v3trans.home.attu.manage")}
              <span className="horizontal_shooting_star" />
            </div>
            <div
              className={clsx("shooting-title", {
                active: activeExample === 2,
              })}
              role="button"
              onClick={() => handleActiveClick(2)}
              onKeyDown={() => handleActiveClick(2)}
              tabIndex={0}
            >
              {t("v3trans.home.attu.operation")}
              <span className="horizontal_shooting_star" />
            </div>
            <div className="btn-groups">
              <CustomIconLink
                to="https://github.com/zilliztech/attu/releases"
                className={`primaryBtnSm download-attu`}
                showIcon={false}
              >
                {t("v3trans.home.attu.download")}
              </CustomIconLink>

              <a
                target="_blank"
                rel="noreference"
                href="https://github.com/zilliztech/attu"
              >
                <button className={`secondaryBtnSm`}>
                  {t("v3trans.home.attu.learn")}
                </button>
              </a>
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
