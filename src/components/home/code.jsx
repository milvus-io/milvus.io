import React, { useMemo, useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { MANAGE_DATA, VECTOR_SEARCH, INSTALL_MILVUS } from "./code-example";
import clsx from "clsx";
import hljs from "highlight.js";
import { Link } from "gatsby-plugin-react-i18next";
import "highlight.js/styles/stackoverflow-light.css";

const HighlightBlock = ({ content }) => {
  const highlightCode = hljs.highlight(content, { language: "python" });
  return (
    <pre>
      <code
        className="hljs home-code-block"
        dangerouslySetInnerHTML={{ __html: highlightCode.value }}
      ></code>
    </pre>
  );
};

function TabPanel(props) {
  const { children, value, index, codeExample, ...other } = props;

  const codeType = useMemo(() => {
    return Object.keys(codeExample)[index];
  }, [index, codeExample]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} style={{ paddingTop: 0 }}>
          {/* <HightLight className="python">{codeExample[codeType]}</HightLight> */}
          <HighlightBlock content={codeExample[codeType]} />
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
  manage: "manage",
  search: "search",
  install: "install",
};
let timeId = null;
let keyIndex = 0;

const Code = props => {
  const { t = () => {} } = props;
  const [value, setValue] = useState(0);
  const [activeExample, setActivExample] = useState(EXAMPLES.install);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    timeId = setInterval(() => {
      const keys = Object.keys(EXAMPLES);
      keyIndex === 2 ? (keyIndex = 0) : keyIndex++;
      setActivExample(EXAMPLES[keys[keyIndex]]);
    }, 10000);
    return () => {
      clearInterval(timeId);
    };
  }, []);

  const codeExample = useMemo(() => {
    switch (activeExample) {
      case EXAMPLES.manage:
        return MANAGE_DATA;
      case EXAMPLES.search:
        return VECTOR_SEARCH;
      case EXAMPLES.install:
        return INSTALL_MILVUS;
      default:
        return INSTALL_MILVUS;
    }
  }, [activeExample]);

  const handleActiveClick = active => {
    const index = Object.keys(EXAMPLES).findIndex(v => v === active);
    keyIndex = index;
    setActivExample(active);

    timeId && clearInterval(timeId);
    timeId = setInterval(() => {
      const keys = Object.keys(EXAMPLES);
      keyIndex === 2 ? (keyIndex = 0) : keyIndex++;
      setActivExample(EXAMPLES[keys[keyIndex]]);
    }, 10000);
  };

  const { tabs, learnMoreLink } = useMemo(() => {
    switch (activeExample) {
      case EXAMPLES.search:
        return {
          tabs: ["Vector search", "hybrid search", "Time travel"],
          learnMoreLink: "/docs/search.md",
        };
      case EXAMPLES.manage:
        return {
          tabs: ["Create collection", "Create index", "Insert data"],
          learnMoreLink: "/docs/create_collection.md",
        };
      case EXAMPLES.install:
      default:
        return {
          tabs: ["Ubuntu", "CentOS", "Kubernetes"],
          learnMoreLink: "/docs/install_cluster-helm.md",
        };
    }
  }, [activeExample]);

  return (
    <section className="section3 col-12 col-8 col-4">
      <Box sx={{ borderColor: "divider" }} className={`code-example-tab`}>
        <Tabs value={value} onChange={handleChange} aria-label="code tab">
          {tabs.map((v, i) => (
            <Tab disableRipple key={v} label={v} {...a11yProps(i)} />
          ))}
        </Tabs>
      </Box>
      <div className="example-wrapper">
        <div className="code-example">
          <TabPanel value={value} index={0} codeExample={codeExample} />
          <TabPanel value={value} index={1} codeExample={codeExample} />
          <TabPanel value={value} index={2} codeExample={codeExample} />
        </div>
        <div className="milvus-feature">
          <div
            className={clsx("shooting-title", {
              active: activeExample === EXAMPLES.install,
            })}
            role="button"
            onClick={() => handleActiveClick(EXAMPLES.install)}
            onKeyDown={() => handleActiveClick(EXAMPLES.install)}
            tabIndex={0}
          >
            {t("v3trans.home.code.install")}
            <span className="horizontal_shooting_star" />
          </div>
          <div
            className={clsx("shooting-title", {
              active: activeExample === EXAMPLES.manage,
            })}
            role="button"
            onClick={() => handleActiveClick(EXAMPLES.manage)}
            tabIndex={0}
            onKeyDown={() => handleActiveClick(EXAMPLES.manage)}
          >
            {t("v3trans.home.code.manage")}
            <span className="horizontal_shooting_star" />
          </div>
          <div
            className={clsx("shooting-title", {
              active: activeExample === EXAMPLES.search,
            })}
            role="button"
            onClick={() => handleActiveClick(EXAMPLES.search)}
            tabIndex={0}
            onKeyDown={() => handleActiveClick(EXAMPLES.search)}
          >
            {t("v3trans.home.code.search")}
            <span className="horizontal_shooting_star" />
          </div>
          <Link to={learnMoreLink}>
            <button className="secondaryBtnSm learn-more">
              {t("v3trans.home.code.learn")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Code;
