import React, { useState, useEffect, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import { CodeBlock } from './CodeBlock';
import { isControlPlane } from './utils';
import styles from './TryItOut.module.css';

const STORAGE_KEY_BASE_URL = 'milvus-tryit-base-url';
const STORAGE_KEY_TOKEN = 'milvus-tryit-token';

const getStoredValue = (key: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const setStoredValue = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const extractExample = (specs: any): string => {
  const requestBody = specs.requestBody;
  if (!requestBody) return '';

  const jsonContent = requestBody.content?.['application/json'];
  if (!jsonContent) return '';

  if (jsonContent.example) {
    return JSON.stringify(jsonContent.example, null, 2);
  }

  if (jsonContent.examples) {
    const firstKey = Object.keys(jsonContent.examples)[0];
    if (firstKey && jsonContent.examples[firstKey]?.value) {
      return JSON.stringify(jsonContent.examples[firstKey].value, null, 2);
    }
  }

  return '';
};

const highlightJson = (code: string) => (
  <Highlight theme={themes.oneLight} code={code} language="json">
    {({ tokens, getLineProps, getTokenProps }) => (
      <>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </>
    )}
  </Highlight>
);

type TryItOutProps = {
  specs: any;
  endpoint: string;
  method: string;
  target: string;
  lang: string;
};

export const TryItOut: React.FC<TryItOutProps> = ({
  specs,
  endpoint,
  method,
  target,
  lang,
}) => {
  const defaultBaseUrl =
    target === 'milvus' ? 'http://localhost:19530' : 'https://api.cloud.zilliz.com';
  const defaultToken =
    target === 'milvus' ? 'root:Milvus' : '';

  const [baseUrl, setBaseUrl] = useState(() =>
    getStoredValue(STORAGE_KEY_BASE_URL, defaultBaseUrl)
  );
  const [token, setToken] = useState(() =>
    getStoredValue(STORAGE_KEY_TOKEN, defaultToken)
  );
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  const defaultBody = extractExample(specs);
  const [body, setBody] = useState(defaultBody);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    body: string;
    time: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize path/query params from spec
  useEffect(() => {
    if (!specs.parameters) return;
    const pp: Record<string, string> = {};
    const qp: Record<string, string> = {};
    for (const param of specs.parameters) {
      if (param.in === 'path') {
        pp[param.name] = param.example || '';
      } else if (param.in === 'query') {
        qp[param.name] = param.example || '';
      }
    }
    setPathParams(pp);
    setQueryParams(qp);
  }, [specs.parameters]);

  // Persist connection settings
  useEffect(() => {
    setStoredValue(STORAGE_KEY_BASE_URL, baseUrl);
  }, [baseUrl]);
  useEffect(() => {
    setStoredValue(STORAGE_KEY_TOKEN, token);
  }, [token]);

  const buildUrl = useCallback(() => {
    let url = endpoint;
    // Replace path params
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    }
    // Add query params
    const qEntries = Object.entries(queryParams).filter(([, v]) => v !== '');
    if (qEntries.length > 0) {
      const qs = qEntries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      url = `${url}?${qs}`;
    }
    // Ensure baseUrl doesn't have trailing slash
    const base = baseUrl.replace(/\/+$/, '');
    return `${base}${url}`;
  }, [endpoint, pathParams, queryParams, baseUrl]);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    const url = buildUrl();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (body && method.toUpperCase() !== 'GET') {
      try {
        // Validate JSON
        JSON.parse(body);
        fetchOptions.body = body;
      } catch {
        setError('Invalid JSON in request body. Please fix the syntax and try again.');
        setLoading(false);
        return;
      }
    }

    const startTime = performance.now();

    try {
      const res = await fetch(url, fetchOptions);
      const elapsed = Math.round(performance.now() - startTime);
      let responseBody: string;
      try {
        const json = await res.json();
        responseBody = JSON.stringify(json, null, 2);
      } catch {
        responseBody = await res.text();
      }
      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: responseBody,
        time: elapsed,
      });
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError(
          `Network error: Unable to reach ${url}. This is likely a CORS issue or the server is not running. ` +
          `Make sure your Milvus instance is running and has CORS enabled.`
        );
      } else {
        setError(`Request failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBody(defaultBody);
    setResponse(null);
    setError(null);
    // Re-init params
    if (specs.parameters) {
      const pp: Record<string, string> = {};
      const qp: Record<string, string> = {};
      for (const param of specs.parameters) {
        if (param.in === 'path') pp[param.name] = param.example || '';
        if (param.in === 'query') qp[param.name] = param.example || '';
      }
      setPathParams(pp);
      setQueryParams(qp);
    }
  };

  const hasPathParams = Object.keys(pathParams).length > 0;
  const hasQueryParams = Object.keys(queryParams).length > 0;

  return (
    <div className={styles.container}>
      {/* Connection Settings */}
      <div className={styles.sectionTitle}>Connection</div>
      <div className={styles.fieldRow}>
        <label className={styles.fieldLabel}>Base URL</label>
        <input
          className={styles.fieldInput}
          value={baseUrl}
          onChange={e => setBaseUrl(e.target.value)}
          placeholder="http://localhost:19530"
        />
      </div>
      <div className={styles.fieldRow}>
        <label className={styles.fieldLabel}>Token</label>
        <input
          className={styles.fieldInput}
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="root:Milvus"
        />
      </div>

      {/* Path Parameters */}
      {hasPathParams && (
        <>
          <hr className={styles.divider} />
          <div className={styles.sectionTitle}>Path Parameters</div>
          {Object.entries(pathParams).map(([name, value]) => (
            <div className={styles.fieldRow} key={name}>
              <label className={styles.fieldLabel}>{name}</label>
              <input
                className={styles.fieldInput}
                value={value}
                onChange={e =>
                  setPathParams(prev => ({ ...prev, [name]: e.target.value }))
                }
              />
            </div>
          ))}
        </>
      )}

      {/* Query Parameters */}
      {hasQueryParams && (
        <>
          <hr className={styles.divider} />
          <div className={styles.sectionTitle}>Query Parameters</div>
          {Object.entries(queryParams).map(([name, value]) => (
            <div className={styles.fieldRow} key={name}>
              <label className={styles.fieldLabel}>{name}</label>
              <input
                className={styles.fieldInput}
                value={value}
                onChange={e =>
                  setQueryParams(prev => ({ ...prev, [name]: e.target.value }))
                }
              />
            </div>
          ))}
        </>
      )}

      {/* Request Body */}
      {defaultBody && (
        <>
          <hr className={styles.divider} />
          <div className={styles.sectionTitle}>Request Body</div>
          <div className={styles.editorWrapper}>
            <Editor
              value={body}
              onValueChange={setBody}
              highlight={highlightJson}
              padding={12}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 13,
                lineHeight: '1.5',
                minHeight: '100px',
              }}
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* CORS Hint */}
      <div className={styles.corsHint}>
        Make sure your Milvus instance has CORS enabled if you are accessing it from the browser.
        For local development, ensure Milvus is running at the Base URL specified above.
      </div>

      {/* Error */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Response */}
      {response && (
        <div className={styles.responseSection}>
          <div className={styles.sectionTitle}>Response</div>
          <div className={styles.responseMeta}>
            <span
              className={`${styles.statusBadge} ${
                response.status >= 200 && response.status < 300
                  ? styles.statusSuccess
                  : styles.statusError
              }`}
            >
              {response.status} {response.statusText}
            </span>
            <span className={styles.timeBadge}>{response.time}ms</span>
          </div>
          <CodeBlock className="language-json" children={response.body} />
        </div>
      )}
    </div>
  );
};
