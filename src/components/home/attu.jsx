import React, { useEffect, useMemo, useState, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
// import { ManageVectorCodes, SearchCodes, IndexCodes } from "./code-example";
import clsx from "clsx";
// import HightLight from "react-highlight";
import { useIntervalWhen } from 'rooks';


const Attu = () => {
  const [when, setWhen] = useState(true);
  const [activeExample, setActivExample] = useState(0);
  const timeid = useRef(0);

  const incremental = () => {
    let el = activeExample + 1;
    if (el > 2) {
      el = 0
    }
    setActivExample(el);
  };

  useIntervalWhen(() => {
    incremental();
  },
    5000,
    when,
    true,
  )

  // const codeExample = useMemo(() => {
  //   switch (activeExample) {
  //     case 0:
  //       return ManageVectorCodes;
  //     case 1:
  //       return SearchCodes;
  //     case 2:
  //       return IndexCodes;
  //     default:
  //       return ManageVectorCodes;
  //   }
  // }, [activeExample]);

  const handleActiveClick = active => {
    if (timeid.current) {
      clearTimeout(timeid.current);
    }
    setWhen(false);
    setActivExample(active);

    timeid.current = setTimeout(() => {
      setWhen(true);
      timeid.current = 0;
    }, 5000)
  };

  return (
    <section className="section3 col-12 col-8 col-4">
      <div className="example-wrapper">
        <div className="milvus-feature">
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
          <p
            className={clsx({ active: activeExample === 0 })}
            role="button"
            onClick={() => handleActiveClick(0)}
          >
            Manage massive vectors
          </p>
          <p
            className={clsx({ active: activeExample === 1 })}
            role="button"
            onClick={() => handleActiveClick(1)}
          >
            Vector similarity search
          </p>
          <p
            className={clsx({ active: activeExample === 2 })}
            role="button"
            onClick={() => handleActiveClick(2)}
          >
            Build with 6 index
          </p>
        </div>


        <div className="code-example">
          {activeExample}
          {/* insert images here*/}
        </div>

      </div>
    </section>
  );
};

export default Attu;
