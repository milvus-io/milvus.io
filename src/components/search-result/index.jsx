import React, { useEffect, useState, useMemo } from 'react';
import { searchByElasic } from '../../http/es';
import './style.scss';

const SearchResult = props => {
  const { lan = 'en', version = 'v1.0.0', text } = props;
  const [results, setResults] = useState([]);
  const indexName = useMemo(() =>
    lan === 'en' ? `milvus-docs-${version}` : `milvus-docs-${version}-cn`
  );
  useEffect(() => {
    const fetchData = async () => {
      const result = [];
      const res = await searchByElasic('Segment', indexName);
      for (let i = 0; i < res.length; i++) {
        // const html = await markdownToHtml(res[i].content[0]);
        result.push({ name: res[i].name, html: res[i].content[0] });
      }
      setResults(result);
    };
    fetchData();
  }, []);

  return (
    <div className="search-result">
      <h1>Search Result</h1>
      <p>{results.length} results found for ‘database’</p>
      <ul>
        {results.map(v => (
          <li key={v.name}>
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
