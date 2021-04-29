import React, { useEffect, useState, useMemo } from 'react';
import { searchByElasic } from '../../http/es';
import { navigate } from '@reach/router';
import './style.scss';

const SearchResult = props => {
  const { language = 'en', version = 'v1.0.0', text } = props;
  const [results, setResults] = useState([]);

  const indexName = useMemo(
    () =>
      language === 'en'
        ? `milvus-docs-${version}`
        : `milvus-docs-${version}-cn`,
    [language, version]
  );
  useEffect(() => {
    const fetchData = async () => {
      const result = [];
      const res = await searchByElasic(text, indexName);
      for (let i = 0; i < res.length; i++) {
        const html = res[i].content[0].replace(/#/g, '');
        result.push({ name: res[i].name, html });
      }
      setResults(result);
    };
    fetchData();
  }, [text, indexName]);

  const handleClick = data => {
    navigate(`/docs/${version}/${data.name}`);
  };

  return (
    <div className="search-result">
      <h1>Search Result</h1>
      <p>
        {results.length} results found for '{text}'
      </p>
      <ul>
        {results.map(v => (
          <li key={v.name} onClick={() => handleClick(v)}>
            <h4 className="title">{v.name}</h4>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: v.html }}
            ></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
