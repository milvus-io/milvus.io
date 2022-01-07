import { useState, useEffect } from "react";
import { getGithubCommits, getFaq } from "./index";
import dayjs from "dayjs";

export function useGithubCommits({ commitPath, version, isDoc = false }) {
  const [commitInfo, setCommitInfo] = useState({
    message: "",
    date: "",
    commitUrl: "",
    source: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGithubCommits(commitPath, version);
        if (res.status === 200 && res.data.length) {
          const lastCommit = res.data[0];
          const message = lastCommit.commit.message.split("\n")[0];
          const date = lastCommit.commit.committer.date;
          const commitUrl = lastCommit.html_url;
          const formatDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
          const source = `https://github.com/milvus-io/milvus-docs/blob/${version}/${commitPath}`;
          setCommitInfo({ commitUrl, date: formatDate, source, message });
        }
      } catch (error) {
        console.error(error);
      }
    };
    isDoc && fetchData();
  }, [commitPath, version, isDoc]);

  return commitInfo;
}

export function useGetFaq(relatedKey) {
  const [relatedQuestions, setRelatedQuestions] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFaq({
          params: {
            question: relatedKey,
            version: 1,
          },
        });
        if (res?.data?.response) {
          setRelatedQuestions(res.data.response.slice(0, 6));
        }
      } catch (error) {
        setRelatedQuestions();
      }
    };
    if (relatedKey) {
      fetchData();
    } else {
      setRelatedQuestions();
    }
  }, [relatedKey]);

  //! TO REMOVE
  const resultMock = {
    response: [
      [
        "Is there a graphical tool for managing Milvus?",
        "As of Milvus v0.7.0, we have provided Milvus Enterprise Manager as a graphical tool for managing Milvus.",
        false,
      ],
      [
        "Questions about milvus clusters",
        "Mishards is a sharded middleware, designed in such a way that it does not change the original structure and usage of milvus, and basically wraps milvus in a black box. 1 write node is responsible for writing and managing data, and mishards only does request forwarding and task distribution. The shared storage is used so that all nodes can read the same data, rather than spreading the data across multiple nodes (which would complicate the logic of mishards). mishards will hash the data to different nodes, and that is by hashing multiple slices into the memory of multiple nodes for searching.\nIn a nutshell, shared storage keeps the data persistent in the same place, and when searched, the data is then sharded into the memory of multiple nodes.",
        false,
      ],
      [
        "more read milvus server without mishard",
        "Theoretically you can manually start multiple read nodes using same mysql and db path.\n",
        false,
      ],
      [
        "Where  are the official test reports on milvus 1.0?",
        "https://github.com/milvus-io/milvus/issues/4831",
        true,
      ],
      [
        "Is milvus working on windows?  ",
        "https://github.com/milvus-io/milvus/issues/273",
        true,
      ],
      [
        "Want an ARM image of Milvus v0.10.x",
        "https://github.com/milvus-io/milvus/issues/4423",
        true,
      ],
      [
        "Can you show me Milvus Meta Schema and description？",
        "https://github.com/milvus-io/milvus/issues/755",
        true,
      ],
      [
        "Can I install Milvus on Windows?",
        "Yes, so long as you have set up a Docker environment on your operating system.",
        false,
      ],
      [
        "where download milvus 0.11.0 version",
        "The docker image is still in docker hub:\ndocker pull milvusdb/milvus:0.11.0-cpu-d101620-4c44c0\nBut it is no longer maintained.",
        false,
      ],
      [
        "What is milvus::CollectionParam?",
        "https://github.com/milvus-io/milvus/issues/3810",
        true,
      ],
      [
        "Is milvus multithreaded",
        "Yes, but when compiling from source some systems might block its ability to use multithreading.",
        false,
      ],
      [
        "Does Milvus support deletion through milvusid？",
        "https://github.com/milvus-io/milvus/issues/1084",
        true,
      ],
      [
        "Does Milvus work with Apple M1",
        "Apple M1 will work once docker is compatible with the chip",
        false,
      ],
      [
        "Where does milvus store the embeddings",
        "It is stored under 'mivlus/db/tables/[collection_name]/[segment_name]/xxxxx.rv'",
        false,
      ],
      [
        "How to build Milvus on ARM?",
        "https://github.com/milvus-io/milvus/issues/4391",
        true,
      ],
      [
        "How to choose an index in Milvus?",
        "It depends on your scenario. See How to Choose an Index in Milvus for more information.",
        false,
      ],
      [
        "Milvus service performance problems",
        "You can refer to Milvus performance tunning.",
        false,
      ],
      [
        "milvus server shut down",
        "https://github.com/milvus-io/milvus/issues/4668",
        true,
      ],
      [
        "Does milvus support NSG?",
        "https://github.com/milvus-io/milvus/issues/249",
        true,
      ],
      [
        "In what way does Milvus flush data?",
        "Milvus loads inserted data to the memory and automatically flushes data from memory to the disk at fixed intervals. You can call flush to manually trigger this operation.",
        false,
      ],
      [
        "What is the maximum vector dimension supported by Milvus?",
        "https://github.com/milvus-io/milvus/issues/4829",
        true,
      ],
      [
        "Why does Milvus return config check error?",
        "The version of configuration file does not match the version your Milvus server.",
        false,
      ],
      [
        "Milvus v0.11.0 release not supported anymore",
        "Yes, we stopped maintainance for 0.11.0 and renamed it to 'experimental'. The main reason is we want to make milvus be a real distributed and cloud-native service. The old architecture can work well as a stand-alone service or small sharding system, but not it is not good enough to be a real distributed system.",
        false,
      ],
      [
        "Is Milvus free of charge?",
        "Milvus is an open-source project, and hence is free-of-charge. Please adhere to Apache License 2.0, when using Milvus for reproduction or distribution purposes.",
        false,
      ],
      [
        "Is Milvus an alternative for Redis?",
        "Actually Milvus is a vector similarity search engine, unlike the traditional databases, Milvus currently only stores vectors and their corresponding ids, although we plan to store more information in future versions. So whether Milvus can totally replace Redis depends on your scenario, if the data only has vectors and ids then Milvus can. However, a lot of data contains more information than just ids, which requires access to a structured database such as Redis or MySQL.\nI think Milvus can really help you if you're moving vector search, it's a great option! In distributed we use shared storage, you can refer to Mishards, also Milvus-Helm.",
        false,
      ],
    ],
  };

  // return relatedQuestions;
  return resultMock.response.slice(0, 6);
}

export function useWindowSize() {
  const [size, setSize] = useState("desktop1024");

  useEffect(() => {
    const onResize = () => {
      const desktop1920 = window.matchMedia("(min-width: 1920px)");
      const desktop1440 = window.matchMedia("(min-width: 1440px)");
      const desktop1024 = window.matchMedia("(min-width: 1024px)");
      const desktop744 = window.matchMedia("(min-width: 744px)");

      if (desktop1920.matches) {
        setSize("desktop1920");
      } else if (desktop1440.matches) {
        setSize("desktop1440");
      } else if (desktop1024.matches) {
        setSize("desktop1024");
      } else if (desktop744.matches) {
        setSize("tablet");
      } else {
        setSize("phone");
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  useEffect(() => {
    const desktop1920 = window.matchMedia("(min-width: 1920px)");
    const desktop1440 = window.matchMedia("(min-width: 1440px)");
    const desktop1024 = window.matchMedia("(min-width: 1024px)");
    const desktop744 = window.matchMedia("(min-width: 744px)");

    if (desktop1920.matches) {
      setSize("desktop1920");
    } else if (desktop1440.matches) {
      setSize("desktop1440");
    } else if (desktop1024.matches) {
      setSize("desktop1024");
    } else if (desktop744.matches) {
      setSize("tablet");
    } else {
      setSize("phone");
    }
  }, []);

  return size;
}
