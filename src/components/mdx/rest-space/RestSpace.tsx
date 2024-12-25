import React, { useState } from 'react';
import { RestHeader } from './RestHeader';
import {
  chooseParamExample,
  getRandomString,
  isControlPlane,
  textFilter,
} from './utils';
import { BaseURL } from './BaseURL';
import { i18n } from './i18n';
import { CodeBlock } from './CodeBlock';

import styles from './RestSpace.module.css';

const primitiveConstants = ['boolean', 'integer', 'number', 'string'];

const Enums = ({
  enums,
  defaultValue,
  lang,
  target,
}: {
  enums: string[];
  defaultValue?: string;
  lang: string;
  target: string;
}) => {
  const [enumItem, setEnumItem] = useState(
    defaultValue ? defaultValue : enums[0]
  );

  const handleEnumChange = e => {
    setEnumItem(e.target.value);
  };

  return (
    <div
      className={styles.description}
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: '0.5rem',
        alignItems: 'center',
      }}
    >
      <label htmlFor="enumSelect" className={styles.paramExample}>
        {i18n[lang]['label.possible.values']}
      </label>
      <div>
        <select id="enumSelect" value={enumItem} onChange={handleEnumChange}>
          {enums
            .map(enumValue => textFilter(enumValue, target))
            .filter(enumValue => enumValue !== '')
            .map((enumValue, index) => {
              enumValue = enumValue
                .replace(/<\/?p>/g, '')
                .replace(/<\/?em>/g, '-');
              return (
                <option key={index} value={enumValue}>
                  {enumValue}
                </option>
              );
            })}
        </select>
      </div>
    </div>
  );
};

const Param = ({
  name,
  description,
  type,
  format,
  required,
  example,
  inProp,
  enums,
  lang,
  target,
}: any) => {
  enums = enums ? enums : [];

  return (
    <div className={styles.paramContainer}>
      <div className={styles.paramLabels}>
        <span className={styles.paramName}>{name}</span>
        <span className={styles.label}>
          {type + (format ? '<' + format + '>' : '')}
        </span>
        <span className={styles.label}>{inProp}</span>
        {required && <span className={styles.required}>required</span>}
      </div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: description
            ? textFilter(description, target)
            : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
        }}
      ></div>
      <div>
        {enums.length > 0 && (
          <Enums enums={enums} lang={lang} target={target} />
        )}
        {(example === 0 || example) && (
          <div>
            <span className={styles.paramExample}>
              {i18n[lang]['label.example.value']}
            </span>
            <span className={styles.label}>{example}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Primitive = ({ name, obj, required, lang, target }: any) => {
  const { type, format, minimum, maximum, defaultValue, example } = obj;
  const description = obj['x-i18n']?.[lang]?.description
    ? obj['x-i18n'][lang].description
    : obj.description;
  const enums = obj.enum ? obj.enum : [];

  return (
    <div className={styles.paramContainer}>
      <div className={styles.paramLabels}>
        <span className={styles.paramName}>{name}</span>
        <span className={styles.label}>
          {type + (format ? '<' + format + '>' : '')}
        </span>
        {required && (
          <span className={styles.required}>
            {i18n[lang]['label.required']}
          </span>
        )}
      </div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: description
            ? textFilter(description, target)
            : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
        }}
      ></div>
      <div>
        {(minimum || maximum) && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className={styles.paramExample}>
              {i18n[lang]['label.value.range']}
            </span>
            {minimum && (
              <span className={styles.label}>
                {obj.exclusiveMinimum ? `\> ${minimum}` : `\≥ ${minimum}`}
              </span>
            )}
            {maximum && (
              <span className={styles.label}>
                {obj.exclusiveMaximum ? `\< ${maximum}` : `\≤ ${maximum}`}
              </span>
            )}
          </div>
        )}
        {enums.length > 0 && (
          <Enums
            enums={enums}
            defaultValue={defaultValue}
            lang={lang}
            target={target}
          />
        )}
        {defaultValue && (
          <div>
            <span className={styles.paramExample}>
              {i18n[lang]['label.default.value']}
            </span>
            <span className={styles.label}>{defaultValue}</span>
          </div>
        )}
        {(example === 0 || example) && (
          <div>
            <span className={styles.paramExample}>
              {i18n[lang]['label.example.value']}
            </span>
            <span className={styles.label}>{example}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Tab = ({ name, id, content, lang, target, selected, setSelected }) => {
  const value = (
    content.label ? content.label : `${i18n[lang]['tab.option']} ${id}`
  ).toUpperCase();
  const label = (
    content?.['x-tab-label'] ? content['x-tab-label'] : value
  ).toUpperCase();

  return (
    <>
      <input
        name={name}
        type="radio"
        id={`${name}-tab${id}`}
        checked={selected === value}
        value={value}
        onChange={e => {
          setSelected(e.target.value);
        }}
      />
      <label className={styles.tabLabel} htmlFor={`${name}-tab${id}`}>
        {label}
      </label>
      <div className={styles.tabPanel}>
        {content?.type === 'object' && (
          <Properties
            description={content.description}
            properties={content.properties}
            requiredFields={content.required}
            lang={lang}
            target={target}
          />
        )}
        {content?.type === 'array' && (
          <Items
            description={content.description}
            obj={content.items}
            required={content.items.required}
            lang={lang}
            target={target}
          />
        )}
        {content?.type === 'string' ||
          content?.type === 'number' ||
          content?.type === 'integer' ||
          (content?.type === 'boolean' && (
            <Primitive obj={content} lang={lang} target={target} />
          ))}
        {content?.type === 'code' && (
          <CodeBlock
            className="language-json"
            children={JSON.stringify(content.value, null, 4)}
          />
        )}
        {content?.type === 'reqs' && (
          <CodeBlock className="language-bash" children={content.value} />
        )}
      </div>
    </>
  );
};

const AnyOf = ({
  name,
  description,
  arr,
  required,
  lang,
  target,
  onValueChange,
}: any) => {
  const r = getRandomString(5);

  const defaultValue = (
    arr[0].label ? arr[0].label : `${i18n[lang]['tab.option']} 1`
  ).toUpperCase();
  const [selected, setSelected] = useState(defaultValue);

  const setSelectedOption = value => {
    setSelected(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <>
      {name && name !== 'responses' && name !== 'requestBody' && (
        <div className={styles.paramContainer}>
          <div className={styles.paramLabels}>
            <span className={styles.paramName}>{name}</span>
            <span className={styles.label}>anyOf</span>
            {required && <span className={styles.required}>required</span>}
          </div>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: description
                ? textFilter(description, target)
                : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
            }}
          ></div>
        </div>
      )}
      <div
        style={{
          margin:
            name && name !== 'responses' && name !== 'requestBody'
              ? '0 0 0 2rem'
              : '0',
        }}
      >
        <div className={styles.tabs} style={{ marginTop: '1rem' }}>
          {arr.map((item, index) => {
            return (
              <Tab
                key={index}
                name={`${name}-${r}`}
                id={index + 1}
                content={item}
                lang={lang}
                target={target}
                selected={selected}
                setSelected={setSelectedOption}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

const OneOf = ({
  name,
  description,
  arr,
  required,
  lang,
  target,
  onValueChange,
}: any) => {
  const r = getRandomString(5);

  const defaultValue = (
    arr[0].label ? arr[0].label : `${i18n[lang]['tab.option']} 1`
  ).toUpperCase();
  const [selected, setSelected] = useState(defaultValue);

  const setSelectedOption = value => {
    setSelected(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <>
      {name && name !== 'responses' && name !== 'requestBody' && (
        <div className={styles.paramContainer}>
          <div className={styles.paramLabels}>
            <span className={styles.paramName}>{name}</span>
            <span className={styles.label}>oneOf</span>
            {required && <span className={styles.required}>required</span>}
          </div>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: description
                ? textFilter(description, target)
                : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
            }}
          ></div>
        </div>
      )}
      <div
        style={{
          margin:
            name && name !== 'responses' && name !== 'requestBody'
              ? '0 0 0 2rem'
              : '0',
        }}
      >
        <div className={styles.tabs} style={{ marginTop: '1rem' }}>
          {arr.map((item, index) => {
            return (
              <Tab
                key={index}
                name={`${name}-${r}`}
                id={index + 1}
                content={item}
                lang={lang}
                target={target}
                selected={selected}
                setSelected={setSelectedOption}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

const Items = ({ name, description, obj, required, lang, target }: any) => {
  return (
    <>
      {(name || description) && (
        <div className={styles.paramContainer}>
          {name && (
            <div className={styles.paramLabels}>
              <span className={styles.paramName}>{name}</span>
              <span className={styles.label}>array</span>
              {required && <span className={styles.required}>required</span>}
            </div>
          )}
          {description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: description
                  ? textFilter(description, target)
                  : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
              }}
            ></div>
          )}
        </div>
      )}
      <div style={{ margin: name ? '0 0 0 2rem' : '0' }}>
        {obj.items && Object.keys(obj.items).includes('anyOf') && (
          <AnyOf
            name={`[]${name}`}
            description={obj.items.description}
            arr={obj.items.anyOf}
            required={obj.items.required}
            lang={lang}
            target={target}
          />
        )}
        {obj.items && Object.keys(obj.items).includes('oneOf') && (
          <OneOf
            name={`[]${name}`}
            description={obj.items.description}
            arr={obj.items.oneOf}
            required={obj.items.required}
            lang={lang}
            target={target}
          />
        )}
        {obj.items?.type === 'object' && (
          <Properties
            name={`[]${name}`}
            description={obj.items.description}
            properties={obj.items.properties}
            requiredFields={obj.items.required}
            required={required}
            lang={lang}
            target={target}
          />
        )}
        {obj.items?.type === 'array' && (
          <Items
            name={`[]${name}`}
            description={obj.items.description}
            obj={obj.items.items}
            required={obj.items.items.required}
            lang={lang}
            target={target}
          />
        )}
        {primitiveConstants.includes(obj.items?.type) && obj.items?.type && (
          <Primitive
            name={`[]${name}`}
            obj={obj.items}
            required={obj.items.required}
            lang={lang}
            target={target}
          />
        )}
      </div>
    </>
  );
};

const Properties = ({
  name,
  description,
  properties,
  requiredFields,
  required,
  lang,
  target,
}: any) => {
  return (
    <>
      {(name || description) && (
        <div className={styles.paramContainer}>
          {name && (
            <div className={styles.paramLabels}>
              <span className={styles.paramName}>{name}</span>
              <span className={styles.label}>object</span>
              {required && <span className={styles.required}>required</span>}
            </div>
          )}
          {description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: description
                  ? textFilter(description, target)
                  : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
              }}
            ></div>
          )}
        </div>
      )}
      <div style={{ margin: name ? '0 0 0 2rem' : '0' }}>
        {properties &&
          Object.keys(properties)
            .filter(key => {
              if (Object.keys(properties[key]).includes('x-include-target')) {
                return properties[key]['x-include-target'].includes(target);
              }

              return true;
            })
            .map((propName, index) => {
              const prop = properties[propName];
              const desc = prop['x-i18n']?.[lang]?.description
                ? prop['x-i18n'][lang].description
                : prop.description;
              const requireds =
                requiredFields instanceof Array ? requiredFields : [];
              if (prop.type === 'object') {
                return (
                  <Properties
                    key={index}
                    name={propName}
                    description={textFilter(desc, target)}
                    properties={prop.properties}
                    requiredFields={prop.required}
                    required={requireds.includes(propName)}
                    lang={lang}
                    target={target}
                  />
                );
              } else if (prop.type === 'array') {
                return (
                  <Items
                    key={index}
                    name={propName}
                    description={textFilter(desc, target)}
                    obj={prop}
                    required={requireds.includes(propName)}
                    lang={lang}
                    target={target}
                  />
                );
              } else if (prop?.anyOf) {
                return (
                  <AnyOf
                    key={index}
                    name={propName}
                    description={textFilter(desc, target)}
                    arr={prop.anyOf}
                    required={requireds.includes(propName)}
                    lang={lang}
                    target={target}
                  />
                );
              } else if (prop?.oneOf) {
                return (
                  <OneOf
                    key={index}
                    name={propName}
                    description={textFilter(desc, target)}
                    arr={prop.oneOf}
                    required={requireds.includes(propName)}
                    lang={lang}
                    target={target}
                  />
                );
              } else {
                return (
                  <Primitive
                    key={index}
                    name={propName}
                    obj={prop}
                    required={requireds.includes(propName)}
                    lang={lang}
                    target={target}
                  />
                );
              }
            })}
      </div>
    </>
  );
};

const ExampleResponses = ({
  examples,
  lang,
  target,
  selectedResponse,
}: any) => {
  const r = getRandomString(5);

  const validKeys = Object.keys(examples).filter(key => {
    var condition = true;

    if (Object.keys(examples[key]).includes('x-include-target')) {
      condition =
        condition && examples[key]['x-include-target'].includes(target);
    }

    if (Object.keys(examples[key]).includes('x-target-lang')) {
      condition = condition && examples[key]['x-target-lang'] === lang;
    }

    if (Object.keys(examples[key]).includes('x-target-response')) {
      condition =
        condition && examples[key]['x-target-response'] === selectedResponse;
    }

    return condition;
  });

  const defaultValue = examples[validKeys[0]].summary.toUpperCase();
  const availableLabels = validKeys.map(key =>
    examples[key].summary.toUpperCase()
  );
  const [selected, setSelected] = useState(defaultValue);

  if (!availableLabels.includes(selected)) {
    setSelected(availableLabels[0]);
  }

  return (
    <div className={styles.tabs} style={{ marginTop: '1rem' }}>
      {validKeys.map((key, index) => {
        return (
          <Tab
            key={index}
            name={'resExamples' + '-' + r}
            id={parseInt(key)}
            content={{
              type: 'code',
              label: examples[key].summary,
              value: examples[key].value,
            }}
            lang={lang}
            target={target}
            selected={selected}
            setSelected={setSelected}
          />
        );
      })}
    </div>
  );
};

const ExampleRequests = ({
  endpoint,
  method,
  headersExample,
  pathExample,
  queryExample,
  requestBody,
  lang,
  target,
  selectedRequest,
}: any) => {
  const condition = isControlPlane(endpoint);
  const baseUrl = condition ? '${BASE_URL}' : '${CLUSTER_ENDPOINT}';
  const token = condition ? 'YOUR_API_KEY' : 'root:Milvus';
  var req = `export TOKEN="${token}"${
    pathExample ? '\n' + pathExample : ''
  }\n\ncurl --request ${method.toUpperCase()} \\\n--url "${baseUrl}${endpoint}`;
  req = (queryExample ? `${req}?${queryExample}` : req) + `"`;
  req = headersExample
    ? `${req} \\\n${
        headersExample + ` \\\n--header "Content-Type: application/json"`
      }`
    : req;

  if (requestBody?.content['application/json']?.example) {
    req += ` \\\n-d '${JSON.stringify(
      requestBody.content['application/json'].example,
      null,
      4
    )}'`;
    return <CodeBlock className="language-bash" children={req} />;
  }

  if (!requestBody) {
    return <CodeBlock className="language-bash" children={req} />;
  }

  if (requestBody?.content['application/json']?.examples) {
    const r = getRandomString(5);
    const examples = requestBody.content['application/json'].examples;
    const validKeys = Object.keys(examples).filter(key => {
      var condition = true;

      if (Object.keys(examples[key]).includes('x-include-target')) {
        condition = examples[key]['x-include-target'].includes(target);
      }

      if (Object.keys(examples[key]).includes('x-target-lang')) {
        condition = condition && examples[key]['x-target-lang'] === lang;
      }

      if (Object.keys(examples[key]).includes('x-target-request')) {
        condition =
          condition && examples[key]['x-target-request'] === selectedRequest;
      }

      return condition;
    });

    const defaultValue = examples[validKeys[0]].summary.toUpperCase();
    const availableLabels = validKeys.map(key =>
      examples[key].summary.toUpperCase()
    );
    const [selected, setSelected] = useState(defaultValue);

    if (!availableLabels.includes(selected)) {
      setSelected(availableLabels[0]);
    }

    return (
      <div className={styles.tabs} style={{ marginTop: '1rem' }}>
        {validKeys.length === 1 && (
          <CodeBlock
            className="language-bash"
            children={`${req} \\\n-d '${JSON.stringify(
              examples[validKeys[0]].value,
              null,
              4
            )}'`}
          />
        )}
        {validKeys.length > 1 &&
          validKeys.map((key, index) => {
            return (
              <Tab
                key={index}
                name={'reqExamples' + '-' + r}
                id={parseInt(key)}
                content={{
                  type: 'reqs',
                  label: examples[key].summary,
                  value: `${req} \\\n-d '${JSON.stringify(
                    examples[key].value,
                    null,
                    4
                  )}'`,
                }}
                lang={lang}
                target={target}
                selected={selected}
                setSelected={setSelected}
              />
            );
          })}
      </div>
    );
  }
};

export const RestSpecs = props => {
  const {
    summary,
    tags,
    parameters,
    requestBody,
    responses,
    description,
    deprecated,
  } = props.specs;

  const target = props.target;
  const lang = props.lang ? props.lang : 'en-US';
  const endpoint = props.endpoint.replaceAll('{', '${');
  const validParams = parameters
    ? parameters.filter(
        param =>
          !param?.['x-include-target'] ||
          param?.['x-include-target']?.includes(target)
      )
    : [];

  const short = textFilter(description, target);
  const headerParams = validParams
    ? validParams.filter(param => param.in === 'header')
    : [];
  const headersExample = headerParams
    .map(param => `--header "${param.name}: ${param.example}"`)
    .join(' \\\n')
    .replace(/{{/g, '${')
    .replace(/}}/g, '}');
  const pathParams = validParams
    ? validParams.filter(param => param.in === 'path')
    : [];
  const pathExample = pathParams
    .map(param => {
      param = chooseParamExample(param, lang, target);
      return `export ${param.name}="${param.example}"`;
    })
    .join('\n');
  const queryParams = validParams
    ? validParams.filter(param => param.in === 'query')
    : [];
  const queryExample = queryParams
    .map(param => {
      param = chooseParamExample(param, lang, target);
      return param.required ? `${param.name}=${param.example}` : '';
    })
    .filter(param => param !== '')
    .join('&');
  const responseExample =
    responses?.['200']?.content['application/json']?.examples;

  const [selectedRequest, setSelectedRequest] = useState('OPTION 1');
  const [selectedResponse, setSelectedResponse] = useState('OPTION 1');

  const handleMultipleRequests = value => {
    setSelectedRequest(value.toUpperCase());
  };

  const handleMultipleResponses = value => {
    setSelectedResponse(value.toUpperCase());
  };

  return (
    <div className={styles.container}>
      <div
        style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '60% 40%' }}
      >
        <div>
          <div dangerouslySetInnerHTML={{ __html: short }} />
          <RestHeader method={props.method} endpoint={props.endpoint} />
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: '60% 40%',
        }}
      >
        <BaseURL endpoint={props.endpoint} lang={lang} target={target} />
        {(parameters.length > 0 || requestBody) && (
          <>
            <section>
              {parameters.length > 0 && (
                <section>
                  <div className={styles.sectionHeader}>
                    <span>{i18n[lang]['section.parameters']}</span>
                  </div>
                  {headerParams.length > 0 &&
                    headerParams.map((param, index) => {
                      param = chooseParamExample(param, lang, target);
                      return (
                        <Param
                          key={index}
                          lang={lang}
                          target={target}
                          name={param.name}
                          description={
                            param['x-i18n']?.[lang]?.description
                              ? param['x-i18n']?.[lang]?.description
                              : param.description
                          }
                          type={param.schema.type}
                          required={param.required}
                          example={param.example}
                          inProp={param.in}
                          enums={param.schema.enum}
                        />
                      );
                    })}
                  {pathParams.length > 0 &&
                    pathParams.map((param, index) => {
                      param = chooseParamExample(param, lang, target);
                      return (
                        <Param
                          key={index}
                          lang={lang}
                          target={target}
                          name={param.name}
                          description={
                            param.i18n?.[lang]?.description
                              ? param.i18n[lang].description
                              : param.description
                          }
                          type={param.schema.type}
                          required={param.required}
                          example={param.example}
                          inProp={param.in}
                          enums={param.schema.enum}
                        />
                      );
                    })}
                  {queryParams.length > 0 &&
                    queryParams.map((param, index) => {
                      param = chooseParamExample(param, lang, target);
                      return (
                        <Param
                          key={index}
                          lang={lang}
                          target={target}
                          name={param.name}
                          description={
                            param.i18n?.[lang]?.description
                              ? param.i18n[lang].description
                              : param.description
                          }
                          type={param.schema.type}
                          required={param.required}
                          example={param.example}
                          inProp={param.in}
                          enums={param.schema.enum}
                        />
                      );
                    })}
                </section>
              )}
              {requestBody && (
                <section>
                  <section>
                    <div
                      className={styles.sectionHeader}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{i18n[lang]['section.request.body']}</span>
                      {Object.keys(requestBody.content).includes(
                        'application/json'
                      ) && (
                        <span
                          style={{
                            color: 'rgb(74, 83, 104)',
                            fontSize: '0.8rem',
                            fontFamily: 'GeistMono, monospace',
                          }}
                        >
                          application/json
                        </span>
                      )}
                    </div>
                    <div style={{ margin: '1rem' }} />
                    {requestBody.content['application/json']?.schema?.type ===
                      'object' && (
                      <Properties
                        properties={
                          requestBody.content['application/json'].schema
                            .properties
                        }
                        requiredFields={
                          requestBody.content['application/json'].schema
                            .required
                        }
                        target={target}
                        lang={lang}
                      />
                    )}
                    {requestBody.content['application/json']?.schema?.type ===
                      'array' && (
                      <Items
                        name="[]requestBody"
                        description={
                          requestBody.content['application/json'].schema
                            .description
                        }
                        obj={
                          requestBody.content['application/json'].schema.items
                        }
                        required={
                          requestBody.content['application/json'].schema.items
                            .required
                        }
                        lang={lang}
                        target={target}
                      />
                    )}
                    {requestBody.content['application/json']?.schema?.anyOf && (
                      <AnyOf
                        name="requestBody"
                        arr={
                          requestBody.content['application/json'].schema.anyOf
                        }
                        lang={lang}
                        target={target}
                        onValueChange={handleMultipleRequests}
                      />
                    )}
                    {requestBody.content['application/json']?.schema?.oneOf && (
                      <OneOf
                        name="requestBody"
                        arr={
                          requestBody.content['application/json'].schema.oneOf
                        }
                        lang={lang}
                        target={target}
                        onValueChange={handleMultipleRequests}
                      />
                    )}
                    {requestBody.content['application/json']?.schema?.type !==
                      'object' &&
                      requestBody.content['application/json']?.schema?.type !==
                        'array' &&
                      !Object.keys(
                        requestBody.content['application/json'].schema
                      ).includes('anyOf') &&
                      !Object.keys(
                        requestBody.content['application/json'].schema
                      ).includes('oneOf') && (
                        <Primitive
                          name="requestBody"
                          obj={requestBody.content['application/json'].schema}
                          lang={lang}
                          target={target}
                        />
                      )}
                  </section>
                </section>
              )}
            </section>
            <section className={styles.exampleContainer}>
              <ExampleRequests
                endpoint={endpoint}
                method={props.method}
                headersExample={headersExample}
                pathExample={pathExample}
                queryExample={queryExample}
                requestBody={requestBody}
                lang={lang}
                target={target}
                selectedRequest={selectedRequest}
              />
            </section>
          </>
        )}
      </div>
      {responses && (
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: '60% 40%',
          }}
        >
          <section>
            <div
              className={styles.sectionHeader}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <span>{i18n[lang]['section.responses']}</span>
              {Object.keys(responses).includes('200') && (
                <span
                  style={{
                    color: 'rgb(74, 83, 104)',
                    fontSize: '0.8rem',
                    fontFamily: 'Geist Mono, monospace',
                  }}
                >
                  200{' '}
                  {Object.keys(responses['200'].content).includes(
                    'application/json'
                  ) && ' - application/json'}
                </span>
              )}
            </div>
            <div style={{ margin: '1rem' }} />
            {responses['200']?.content['application/json']?.schema?.anyOf && (
              <AnyOf
                name="responses"
                arr={responses['200'].content['application/json'].schema.anyOf}
                lang={lang}
                target={target}
                onValueChange={handleMultipleResponses}
              />
            )}
            {responses['200']?.content['application/json']?.schema?.oneOf && (
              <OneOf
                name="responses"
                arr={responses['200'].content['application/json'].schema.oneOf}
                lang={lang}
                target={target}
                onValueChange={handleMultipleResponses}
              />
            )}
            {responses['200']?.content['application/json']?.schema?.type ===
              'object' && (
              <Properties
                properties={
                  responses['200'].content['application/json'].schema.properties
                }
                requiredFields={
                  responses['200'].content['application/json'].schema.required
                }
                lang={lang}
                target={target}
              />
            )}
            {responses['200']?.content['application/json']?.schema?.type ===
              'array' && (
              <Items
                name="responses[]"
                description={
                  responses['200'].content['application/json'].schema
                    .description
                }
                obj={responses['200'].content['application/json'].schema.items}
                required={
                  responses['200'].content['application/json'].schema.items
                    .required
                }
                lang={lang}
                target={target}
              />
            )}
            {responses['200']?.content['application/json']?.schema?.type !==
              'object' &&
              responses['200']?.content['application/json']?.schema?.type !==
                'array' &&
              !Object.keys(
                responses['200'].content['application/json'].schema
              ).includes('anyOf') &&
              !Object.keys(
                responses['200'].content['application/json'].schema
              ).includes('oneOf') && (
                <Primitive
                  name="responses"
                  obj={responses['200'].content['application/json'].schema}
                  lang={lang}
                  target={target}
                />
              )}
          </section>
          <section className={styles.exampleContainer}>
            {responseExample && (
              <ExampleResponses
                examples={responseExample}
                lang={lang}
                target={target}
                selectedResponse={selectedResponse}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
};
