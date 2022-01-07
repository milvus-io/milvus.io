import React, { useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { ManageVectorCodes, SearchCodes, IndexCodes } from "./code-example";
import clsx from "clsx";
import HightLight from "react-highlight";
function TabPanel(props) {
  const { children, value, index, codeExample, ...other } = props;

  const codeType = useMemo(() => {
    switch (index) {
      case 0:
        return "python";
      case 1:
        return "javascript";
      case 2:
        return "cli";
      default:
        return "python";
    }
  }, [index]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <HightLight className={codeType}>
            {`
from pymilvus import Collection
              `}
          </HightLight>
          {/* <pre className={codeType}>
            <code></code>
          </pre> */}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EXAMPLES = {
  manage: "manageVector",
  search: "search",
  index: "index",
};
let timeId = null;
let keyIndex = 0;

const Code = () => {
  const [value, setValue] = useState(0);
  const [activeExample, setActivExample] = useState(EXAMPLES.manage);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // useEffect(() => {
  //   timeId = setInterval(() => {
  //     const keys = Object.keys(EXAMPLES);
  //     keyIndex === 2 ? (keyIndex = 0) : keyIndex++;
  //     setActivExample(EXAMPLES[keys[keyIndex]]);
  //   }, 6000);
  //   return () => {
  //     clearInterval(timeId);
  //   };
  // }, []);

  const codeExample = useMemo(() => {
    switch (activeExample) {
      case EXAMPLES.manage:
        return ManageVectorCodes;
      case EXAMPLES.search:
        return SearchCodes;
      case EXAMPLES.index:
        return IndexCodes;
      default:
        return ManageVectorCodes;
    }
  }, [activeExample]);

  const handleActiveClick = active => {
    const index = Object.keys(EXAMPLES).findIndex(v => v === active);
    keyIndex = index;
    setActivExample(active);

    // timeId && clearInterval(timeId);
    // timeId = setInterval(() => {
    //   const keys = Object.keys(EXAMPLES);
    //   keyIndex === 2 ? (keyIndex = 0) : keyIndex++;
    //   setActivExample(EXAMPLES[keys[keyIndex]]);
    // }, 6000);
  };

  return (
    <section className="section3 col-12 col-8 col-4">
      <Box sx={{ borderColor: "divider", padding: "0 20px" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Python" {...a11yProps(0)} />
          <Tab label="Node" {...a11yProps(1)} />
          <Tab label="Cli" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <div className="example-wrapper">
        <div className="code-example">
          <TabPanel value={value} index={0} codeExample={codeExample} />
          <TabPanel value={value} index={1} codeExample={codeExample} />
          <TabPanel value={value} index={2} codeExample={codeExample} />
        </div>
        <div className="milvus-feature">
          <div className="shooting_star_container manage-shooting">
            <div
              className={clsx({
                shooting_star: activeExample === EXAMPLES.manage,
              })}
            ></div>
          </div>
          <div className="shooting_star_container search-shooting">
            <div
              className={clsx({
                shooting_star: activeExample === EXAMPLES.search,
              })}
            ></div>
          </div>
          <div className="shooting_star_container index-shooting">
            <div
              className={clsx({
                shooting_star: activeExample === EXAMPLES.index,
              })}
            ></div>
          </div>
          <p
            className={clsx({ active: activeExample === EXAMPLES.manage })}
            role="button"
            onClick={() => handleActiveClick(EXAMPLES.manage)}
          >
            Manage massive vectors
          </p>
          <p
            className={clsx({ active: activeExample === EXAMPLES.search })}
            role="button"
            onClick={() => handleActiveClick(EXAMPLES.search)}
          >
            Vector similarity search
          </p>
          <p
            className={clsx({ active: activeExample === EXAMPLES.index })}
            role="button"
            onClick={() => handleActiveClick(EXAMPLES.index)}
          >
            Build with 6 index
          </p>
        </div>
      </div>
    </section>
  );
};

export default Code;
