import React, { useEffect, useState } from 'react';
import { RestHeader } from './RestHeader';
import {
  chooseParamExample,
  filterSchemaOptions,
  getDefaultResponseStatus,
  getExampleLabel,
  getLocalizedDescription,
  getRandomString,
  getResponseEntries,
  isControlPlane,
  textFilter,
} from './utils';
import { BaseURL } from './BaseURL';
import { i18n } from './i18n';
import { CodeBlock } from './CodeBlock';
import { TryItOut } from './TryItOut';
import { Admonition } from './Admonition';

import styles from './RestSpace.module.css';
import tryItStyles from './TryItOut.module.css';

const primitiveConstants = ['boolean', 'integer', 'number', 'string'];

// The local Admonition requires an `icon`; upstream (Docusaurus) omits it.
// Provide a sensible default per admonition type.
const admonitionIcons: Record<string, string> = {
  note: '📝',
  tip: '💡',
  info: '📘',
  warning: '⚠️',
  danger: '🛑',
};

// Title-case tab labels instead of shouting them in full upper case
// (ported from zdoc RestSpecs).
const capitalizeDisplayLabel = (value = '') =>
  value
    .toString()
    .replace(
      /(^|[\s([/-])([a-z])/g,
      (_match, prefix, char) => `${prefix}${char.toUpperCase()}`
    );

const Admonitions = ({ admonitions, lang }: any) => {
  if (!admonitions || admonitions.length === 0) {
    return null;
  }

  return (
    <>
      {admonitions.map((item, index) => {
        const title = item['x-i18n']?.[lang]?.title
          ? item['x-i18n'][lang].title
          : item.title;
        const content = item['x-i18n']?.[lang]?.content
          ? item['x-i18n'][lang].content
          : item.content;
        const type = item.type || 'info';
        return (
          <Admonition
            key={index}
            type={type}
            icon={admonitionIcons[type] || admonitionIcons.info}
            title={title || item.type || 'Note'}
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Admonition>
        );
      })}
    </>
  );
};

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
            .map(enumValue => textFilter(enumValue, target, lang))
            .filter(enumValue => enumValue !== '')
            .map((enumValue, index) => {
              enumValue = enumValue
                .replace(/<\/?p>/g, '')
                .replace(/<\/?em>/g, '_');
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
  x_i18n,
  admonitions,
}: any) => {
  enums = enums ? enums : [];
  const translatedDescription = x_i18n?.[lang]?.description
    ? x_i18n[lang].description
    : description;

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
          __html: translatedDescription
            ? textFilter(translatedDescription, target, lang)
            : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
        }}
      ></div>
      <div>
        {admonitions && admonitions.length > 0 && (
          <Admonitions admonitions={admonitions} lang={lang} />
        )}
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
  const { type, format, minimum, maximum, defaultValue } = obj;
  const description = obj['x-i18n']?.[lang]?.description
    ? obj['x-i18n'][lang].description
    : obj.description;
  const example = obj['x-i18n']?.[lang]?.example
    ? obj['x-i18n'][lang].example
    : obj.example;
  const enums = obj.enum ? obj.enum : [];
  const admonitions = obj['x-admonition'];

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
            ? textFilter(description, target, lang)
            : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
        }}
      ></div>
      <div>
        {admonitions && admonitions.length > 0 && (
          <Admonitions admonitions={admonitions} lang={lang} />
        )}
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

const Tab = ({
  name,
  id,
  content,
  lang,
  target,
  selected,
  setSelected,
  optionValue,
}: any) => {
  // Handle undefined content
  if (!content) {
    return null;
  }

  const fallbackLabel = content.label
    ? content.label
    : `${i18n[lang]['tab.option']} ${id}`;
  const value = (optionValue || fallbackLabel).toUpperCase();
  const label = content?.['x-tab-label']
    ? content['x-tab-label']
    : fallbackLabel;
  const displayLabel = capitalizeDisplayLabel(label);

  // Handle x-i18n for content description
  const translatedDescription = content?.['x-i18n']?.[lang]?.description
    ? content['x-i18n'][lang].description
    : content?.description;

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
      <label
        className={styles.tabLabel}
        htmlFor={`${name}-tab${id}`}
        onMouseDown={e => e.preventDefault()}
        onClick={e => {
          // Drive selection from the label click and cancel the native
          // label→radio activation. The radio is visually hidden, so letting
          // it receive focus makes the browser scroll it into view — yanking
          // the page to a blank spot on every tab switch. Keyboard users
          // still get onChange above. (Ported from zdoc RestSpecs.)
          e.preventDefault();
          setSelected(value);
        }}
      >
        {displayLabel}
      </label>
      <div className={styles.tabPanel}>
        {content?.type === 'object' && (
          <Properties
            description={translatedDescription}
            properties={content.properties}
            requiredFields={content.required}
            lang={lang}
            target={target}
          />
        )}
        {content?.type === 'array' && (
          <Items
            description={translatedDescription}
            obj={content.items}
            required={content.items.required}
            lang={lang}
            target={target}
          />
        )}
        {(content?.type === 'string' ||
          content?.type === 'number' ||
          content?.type === 'integer' ||
          content?.type === 'boolean') && (
          <Primitive
            obj={{ ...content, description: translatedDescription }}
            lang={lang}
            target={target}
          />
        )}
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

// A combinator (anyOf/oneOf) whose option list filtered down to a single
// entry renders its content directly — a lone tab label carries no choice
// and only adds noise. The panel body is exactly Tab's, minus the radio and
// label. (Ported from zdoc RestSpecs.)
const SingleOption = ({ content, lang, target }: any) => {
  if (!content) {
    return null;
  }

  const translatedDescription = content?.['x-i18n']?.[lang]?.description
    ? content['x-i18n'][lang].description
    : content?.description;

  return (
    <div className={styles.singlePanel}>
      {content?.type === 'object' && (
        <Properties
          description={translatedDescription}
          properties={content.properties}
          requiredFields={content.required}
          lang={lang}
          target={target}
        />
      )}
      {content?.type === 'array' && (
        <Items
          description={translatedDescription}
          obj={content.items}
          required={content.items.required}
          lang={lang}
          target={target}
        />
      )}
      {(content?.type === 'string' ||
        content?.type === 'number' ||
        content?.type === 'integer' ||
        content?.type === 'boolean') && (
        <Primitive
          obj={{ ...content, description: translatedDescription }}
          lang={lang}
          target={target}
        />
      )}
      {content?.$ref && (
        <Primitive
          obj={{
            type: 'object',
            description:
              translatedDescription ||
              `\`${content.$ref.slice('#/components/schemas/'.length)}\` (recursive reference).`,
          }}
          lang={lang}
          target={target}
        />
      )}
      {content?.properties && content?.type === undefined && (
        <Properties
          description={translatedDescription}
          properties={content.properties}
          requiredFields={content.required}
          lang={lang}
          target={target}
        />
      )}
    </div>
  );
};

// A $ref left in place is a recursive component the generator deliberately
// stopped expanding, so the specs blob stays small. Name the type instead of
// falling through to an empty primitive. (Ported from zdoc RestSpecs.)
const RecursiveRef = ({ name, refPath, description, required, lang }: any) => {
  const typeName = refPath.startsWith('#/components/schemas/')
    ? refPath.slice('#/components/schemas/'.length)
    : refPath;

  return (
    <div className={styles.paramContainer}>
      <div className={styles.paramLabels}>
        <span className={styles.paramName}>{name}</span>
        <span className={styles.label}>object ({typeName})</span>
        {required && (
          <span className={styles.required}>
            {i18n[lang]['label.required']}
          </span>
        )}
      </div>
      {description && (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      )}
    </div>
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
  x_i18n,
}: any) => {
  const r = getRandomString(5);
  const translatedDescription = x_i18n?.[lang]?.description
    ? x_i18n[lang].description
    : description;
  const validItems = filterSchemaOptions(arr, lang, target);

  // Map tab labels to option values for responses and requestBody
  const getOptionValue = (label, index) => {
    if (name === 'responses' || name === 'requestBody') {
      // For responses and requestBody, map labels to OPTION 1, OPTION 2, etc.
      return `OPTION ${index + 1}`;
    }
    return (
      label ? label : `${i18n[lang]['tab.option']} ${index + 1}`
    ).toUpperCase();
  };

  const defaultValue =
    validItems.length > 0
      ? getOptionValue(validItems[0].item.label, validItems[0].originalIndex)
      : '';
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue && selected !== defaultValue) {
      setSelected(defaultValue);
    }
    if (onValueChange && defaultValue) {
      onValueChange(defaultValue);
    }
  }, [defaultValue]);

  if (validItems.length === 0) {
    return null;
  }

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
              __html: translatedDescription
                ? textFilter(translatedDescription, target, lang)
                : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
            }}
          ></div>
        </div>
      )}
      {validItems.length === 1 ? (
        <SingleOption
          content={validItems[0].item}
          lang={lang}
          target={target}
        />
      ) : (
        <div
          style={{
            margin:
              name && name !== 'responses' && name !== 'requestBody'
                ? '0 0 0 2rem'
                : '0',
          }}
        >
          <div className={styles.tabs} style={{ marginTop: '1rem' }}>
            {validItems.map(({ item, originalIndex }) => {
              const optionValue = getOptionValue(item.label, originalIndex);
              return (
                <Tab
                  key={originalIndex}
                  name={`${name}-${r}`}
                  id={originalIndex + 1}
                  content={item}
                  lang={lang}
                  target={target}
                  selected={selected}
                  setSelected={setSelectedOption}
                  optionValue={optionValue}
                />
              );
            })}
          </div>
        </div>
      )}
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
  x_i18n,
}: any) => {
  const r = getRandomString(5);
  const translatedDescription = x_i18n?.[lang]?.description
    ? x_i18n[lang].description
    : description;
  const validItems = filterSchemaOptions(arr, lang, target);

  // Map tab labels to option values for responses and requestBody
  const getOptionValue = (label, index) => {
    if (name === 'responses' || name === 'requestBody') {
      // For responses and requestBody, map labels to OPTION 1, OPTION 2, etc.
      return `OPTION ${index + 1}`;
    }
    return (
      label ? label : `${i18n[lang]['tab.option']} ${index + 1}`
    ).toUpperCase();
  };

  const defaultValue =
    validItems.length > 0
      ? getOptionValue(validItems[0].item.label, validItems[0].originalIndex)
      : '';
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue && selected !== defaultValue) {
      setSelected(defaultValue);
    }
    if (onValueChange && defaultValue) {
      onValueChange(defaultValue);
    }
  }, [defaultValue]);

  if (validItems.length === 0) {
    return null;
  }

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
              __html: translatedDescription
                ? textFilter(translatedDescription, target, lang)
                : `<i>${i18n[lang]['to.be.added.soon']}</i>`,
            }}
          ></div>
        </div>
      )}
      {validItems.length === 1 ? (
        <SingleOption
          content={validItems[0].item}
          lang={lang}
          target={target}
        />
      ) : (
        <div
          style={{
            margin:
              name && name !== 'responses' && name !== 'requestBody'
                ? '0 0 0 2rem'
                : '0',
          }}
        >
          <div className={styles.tabs} style={{ marginTop: '1rem' }}>
            {validItems.map(({ item, originalIndex }) => {
              const optionValue = getOptionValue(item.label, originalIndex);
              return (
                <Tab
                  key={originalIndex}
                  name={`${name}-${r}`}
                  id={originalIndex + 1}
                  content={item}
                  lang={lang}
                  target={target}
                  selected={selected}
                  setSelected={setSelectedOption}
                  optionValue={optionValue}
                />
              );
            })}
          </div>
        </div>
      )}
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
                  ? textFilter(description, target, lang)
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
            description={
              obj.items['x-i18n']?.[lang]?.description
                ? obj.items['x-i18n'][lang].description
                : obj.items.description
            }
            arr={obj.items.anyOf}
            required={obj.items.required}
            lang={lang}
            target={target}
          />
        )}
        {obj.items && Object.keys(obj.items).includes('oneOf') && (
          <OneOf
            name={`[]${name}`}
            description={
              obj.items['x-i18n']?.[lang]?.description
                ? obj.items['x-i18n'][lang].description
                : obj.items.description
            }
            arr={obj.items.oneOf}
            required={obj.items.required}
            lang={lang}
            target={target}
          />
        )}
        {obj.items?.type === 'object' && (
          <Properties
            name={`[]${name}`}
            description={
              obj.items['x-i18n']?.[lang]?.description
                ? obj.items['x-i18n'][lang].description
                : obj.items.description
            }
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
            description={
              obj.items['x-i18n']?.[lang]?.description
                ? obj.items['x-i18n'][lang].description
                : obj.items.description
            }
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
        {obj.items?.$ref && (
          <RecursiveRef
            name={`[]${name}`}
            refPath={obj.items.$ref}
            description={textFilter(
              obj.items['x-i18n']?.[lang]?.description
                ? obj.items['x-i18n'][lang].description
                : obj.items.description,
              target,
              lang
            )}
            required={required}
            lang={lang}
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
                  ? textFilter(description, target, lang)
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
                    description={textFilter(desc, target, lang)}
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
                    description={textFilter(desc, target, lang)}
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
                    description={textFilter(desc, target, lang)}
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
                    description={textFilter(desc, target, lang)}
                    arr={prop.oneOf}
                    required={requireds.includes(propName)}
                    lang={lang}
                    target={target}
                  />
                );
              } else if (prop?.$ref) {
                return (
                  <RecursiveRef
                    key={index}
                    name={propName}
                    refPath={prop.$ref}
                    description={textFilter(desc, target, lang)}
                    required={requireds.includes(propName)}
                    lang={lang}
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

const normalizeExampleLabel = (value = '') =>
  value.toString().trim().toLowerCase();

// Resolve which example tab matches the schema option the reader picked:
// OPTION N maps back to the Nth anyOf/oneOf entry's label. (Ported from
// zdoc RestSpecs.)
const getSelectedResponseLabel = (schema, selectedResponse) => {
  const options = schema?.anyOf || schema?.oneOf || [];
  const optionNumber = selectedResponse?.match(/^OPTION\s+(\d+)$/i)?.[1];
  const selectedIndex = optionNumber ? Number(optionNumber) - 1 : -1;
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  return (
    selectedOption?.['x-tab-label'] || selectedOption?.label || selectedResponse
  );
};

const ExampleResponses = ({
  examples,
  schema,
  lang,
  target,
  selectedResponse,
}: any) => {
  const r = getRandomString(5);
  const selectedResponseLabel = getSelectedResponseLabel(
    schema,
    selectedResponse
  );

  const baseValidKeys = Object.keys(examples).filter(key => {
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
  const matchingLabelKeys = baseValidKeys.filter(
    key =>
      !Object.keys(examples[key]).includes('x-target-response') &&
      normalizeExampleLabel(getExampleLabel(examples[key], key)) ===
        normalizeExampleLabel(selectedResponseLabel)
  );
  const validKeys =
    matchingLabelKeys.length > 0 ? matchingLabelKeys : baseValidKeys;

  const defaultValue =
    validKeys.length > 0
      ? getExampleLabel(examples[validKeys[0]], validKeys[0]).toUpperCase()
      : '';
  const availableLabels = validKeys.map(key =>
    getExampleLabel(examples[key], key).toUpperCase()
  );
  const [selected, setSelected] = useState(defaultValue);

  // No example matches the current target/lang/response selection.
  // Render nothing instead of dereferencing `undefined`, which would
  // crash the whole static export (see Import (v2)/Create). Keep this
  // after useState: validKeys follows the selected response option, so an
  // earlier return would change the hook count between renders.
  if (validKeys.length === 0) {
    return null;
  }

  if (!availableLabels.includes(selected)) {
    setSelected(availableLabels[0]);
  }

  if (validKeys.length === 1) {
    const key = validKeys[0];
    // Same casing as the tab labels shown when there are several examples.
    const label = capitalizeDisplayLabel(getExampleLabel(examples[key], key));
    return (
      <div className={styles.singleExample}>
        <CodeBlock
          title={label}
          className="language-json"
          children={JSON.stringify(examples[key].value, null, 4)}
        />
      </div>
    );
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
              label: getExampleLabel(examples[key], key),
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
        headersExample +
        ` \\\n--header "Request-Timeout: 5"` +
        ` \\\n--header "Content-Type: application/json"`
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

    const defaultValue =
      validKeys.length > 0
        ? getExampleLabel(examples[validKeys[0]], validKeys[0]).toUpperCase()
        : '';
    const availableLabels = validKeys.map(key =>
      getExampleLabel(examples[key], key).toUpperCase()
    );
    const [selected, setSelected] = useState(defaultValue);

    // No request example matches the current target/lang/request
    // selection. Fall back to the bare curl command (same as the
    // no-requestBody branch above) instead of dereferencing
    // `undefined`, which would crash the whole static export. Keep this
    // after useState: validKeys follows the selected request option, so
    // an earlier return would change the hook count between renders.
    if (validKeys.length === 0) {
      return <CodeBlock className="language-bash" children={req} />;
    }

    if (!availableLabels.includes(selected)) {
      setSelected(availableLabels[0]);
    }

    if (validKeys.length === 1) {
      const key = validKeys[0];
      // Same casing as the tab labels shown when there are several examples.
      const label = capitalizeDisplayLabel(getExampleLabel(examples[key], key));
      return (
        <div className={styles.singleExample}>
          <CodeBlock
            title={label}
            className="language-bash"
            children={`${req} \\\n-d '${JSON.stringify(
              examples[key].value,
              null,
              4
            )}'`}
          />
        </div>
      );
    }

    return (
      <div className={styles.tabs} style={{ marginTop: '1rem' }}>
        {validKeys.length > 1 &&
          validKeys.map((key, index) => {
            return (
              <Tab
                key={index}
                name={'reqExamples' + '-' + r}
                id={parseInt(key)}
                content={{
                  type: 'reqs',
                  label: getExampleLabel(examples[key], key),
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
  const admonitions = props.specs['x-admonition'];
  const endpoint = props.endpoint.replaceAll('{', '${');
  const validParams = parameters
    ? parameters.filter(
        param =>
          !param?.['x-include-target'] ||
          param?.['x-include-target']?.includes(target)
      )
    : [];

  const short = textFilter(
    getLocalizedDescription(props.specs, lang),
    target,
    lang
  );
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

  const responseEntries = getResponseEntries(responses);
  const responseStatusKey = responseEntries
    .map(({ status }) => status)
    .join(',');
  const defaultResponseStatus = getDefaultResponseStatus(responses);
  const [selectedResponseStatus, setSelectedResponseStatus] = useState(
    defaultResponseStatus
  );
  const selectedResponseEntry =
    responseEntries.find(({ status }) => status === selectedResponseStatus) ||
    responseEntries[0];
  const selectedHttpResponse = selectedResponseEntry?.response;
  const responseMediaType = selectedHttpResponse?.content?.['application/json'];
  const responseSchema = responseMediaType?.schema;
  const responseExample = responseMediaType?.examples;
  const responseDescription =
    selectedHttpResponse?.['x-i18n']?.[lang]?.description ??
    selectedHttpResponse?.description;

  const [showTryIt, setShowTryIt] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState('OPTION 1');
  const [selectedResponse, setSelectedResponse] = useState('OPTION 1');

  useEffect(() => {
    if (
      defaultResponseStatus &&
      !responseEntries.some(({ status }) => status === selectedResponseStatus)
    ) {
      setSelectedResponseStatus(defaultResponseStatus);
    }
  }, [defaultResponseStatus, selectedResponseStatus, responseStatusKey]);

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
          <Admonitions admonitions={admonitions} lang={lang} />
          {deprecated && (
            <Admonition
              type="danger"
              icon={admonitionIcons.danger}
              title={i18n[lang]['admonition.title']}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: i18n[lang]['admonition.deprecated'],
                }}
              />
            </Admonition>
          )}
          <div dangerouslySetInnerHTML={{ __html: short }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <RestHeader method={props.method} endpoint={props.endpoint} />
            <button
              className={`${tryItStyles.tryItButton} ${showTryIt ? tryItStyles.tryItButtonActive : ''}`}
              onClick={() => setShowTryIt(!showTryIt)}
            >
              {showTryIt ? 'Close' : 'Try it out'}
            </button>
          </div>
        </div>
      </div>
      {showTryIt && (
        <TryItOut
          specs={props.specs}
          endpoint={props.endpoint}
          method={props.method}
          target={target}
          lang={lang}
        />
      )}
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
                          description={param.description}
                          type={param.schema.type}
                          required={param.required}
                          example={param.example}
                          inProp={param.in}
                          enums={param.schema.enum}
                          x_i18n={param['x-i18n']}
                          admonitions={param['x-admonition']}
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
                            param['x-i18n']?.[lang]?.description
                              ? param['x-i18n'][lang].description
                              : param.description
                          }
                          type={param.schema.type}
                          required={param.required}
                          example={param.example}
                          inProp={param.in}
                          enums={param.schema.enum}
                          admonitions={param['x-admonition']}
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
                            param['x-i18n']?.[lang]?.description
                              ? param['x-i18n'][lang].description
                              : param.description
                          }
                          type={param.schema.type}
                          required={param.required}
                          example={param.example}
                          inProp={param.in}
                          enums={param.schema.enum}
                          admonitions={param['x-admonition']}
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
                            fontFamily: 'Geist Mono, monospace',
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
                        x_i18n={
                          requestBody.content['application/json'].schema[
                            'x-i18n'
                          ]
                        }
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
                        x_i18n={
                          requestBody.content['application/json'].schema[
                            'x-i18n'
                          ]
                        }
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
      {responseEntries.length > 0 && (
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
              {selectedResponseEntry && (
                <span className={styles.sectionMeta}>
                  {selectedResponseEntry.status}
                  {selectedResponseEntry.label &&
                    ` ${selectedResponseEntry.label}`}
                  {responseMediaType && ' - application/json'}
                </span>
              )}
            </div>
            <div style={{ margin: '1rem' }} />
            {responseEntries.length > 1 && (
              <div
                className={styles.responseStatuses}
                role="group"
                aria-label={i18n[lang]['section.responses']}
              >
                {responseEntries.map(({ status, label }) => (
                  <button
                    key={status}
                    type="button"
                    className={
                      status === selectedResponseEntry?.status
                        ? styles.responseStatusActive
                        : styles.responseStatus
                    }
                    onClick={() => setSelectedResponseStatus(status)}
                  >
                    <span>{status}</span>
                    {label && (
                      <span className={styles.responseStatusLabel}>
                        {label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {responseDescription && (
              <div
                className={styles.responseDescription}
                dangerouslySetInnerHTML={{
                  __html: textFilter(responseDescription, target, lang),
                }}
              />
            )}
            {responseSchema?.anyOf && (
              <AnyOf
                name="responses"
                arr={responseSchema.anyOf}
                lang={lang}
                target={target}
                onValueChange={handleMultipleResponses}
                x_i18n={responseSchema['x-i18n']}
              />
            )}
            {responseSchema?.oneOf && (
              <OneOf
                name="responses"
                arr={responseSchema.oneOf}
                lang={lang}
                target={target}
                onValueChange={handleMultipleResponses}
                x_i18n={responseSchema['x-i18n']}
              />
            )}
            {responseSchema?.type === 'object' && (
              <Properties
                properties={responseSchema.properties}
                requiredFields={responseSchema.required}
                lang={lang}
                target={target}
              />
            )}
            {responseSchema?.type === 'array' && (
              <Items
                name="responses[]"
                description={responseSchema.description}
                obj={responseSchema.items}
                required={responseSchema.items?.required}
                lang={lang}
                target={target}
              />
            )}
            {responseSchema &&
              responseSchema.type !== 'object' &&
              responseSchema.type !== 'array' &&
              !responseSchema.anyOf &&
              !responseSchema.oneOf && (
                <Primitive
                  name="responses"
                  obj={responseSchema}
                  lang={lang}
                  target={target}
                />
              )}
            {!selectedHttpResponse?.content && (
              <p className={styles.emptyResponse}>
                {i18n[lang]['response.no.content']}
              </p>
            )}
          </section>
          {responseExample && (
            <section className={styles.exampleContainer}>
              <ExampleResponses
                examples={responseExample}
                schema={responseSchema}
                lang={lang}
                target={target}
                selectedResponse={selectedResponse}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
};
