import { FC, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';
import { CopyIcon, CheckIcon } from 'lucide-react';

type Props = {
  children: string;
  language?: string;
  className?: string;
};

const HIGHLIGHT_COMMENT = {
  START: '//highlight-start',
  END: '//highlight-end',
  NEXT_LINE: '//highlight-next-line',
};
const HIGHLIGHT_CLASS_NAME = 'bg-black/10 rounded-sm';
let highlightStart = false;
let highlightNextLine = false;

const highlightLine = (
  lineArray: Array<{
    content: string;
    types: string[];
  }>,
  lineProps: { className: string }
) => {
  let shouldExclude = false;

  // Check for highlight-next-line
  if (highlightNextLine) {
    lineProps.className = `${lineProps.className} ${HIGHLIGHT_CLASS_NAME}`;
    highlightNextLine = false;
  }

  lineArray.forEach((line, i) => {
    const content = line.content;

    if (content.replace(/\s/g, '').includes(HIGHLIGHT_COMMENT.NEXT_LINE)) {
      highlightNextLine = true;
      shouldExclude = true;
    }

    // Stop highlighting
    if (
      !!highlightStart &&
      content.replace(/\s/g, '') === HIGHLIGHT_COMMENT.END
    ) {
      highlightStart = false;
      shouldExclude = true;
    }

    // Start highlighting after "//highlight-start"
    if (content.replace(/\s/g, '') === HIGHLIGHT_COMMENT.START) {
      highlightStart = true;
      shouldExclude = true;
    }
  });

  if (!!highlightStart) {
    lineProps.className = `${lineProps.className} ${HIGHLIGHT_CLASS_NAME}`;
  }

  return shouldExclude;
};

const removeCodeHighlightComments = (code: string) => {
  return code
    .split('\n')
    .filter(line => {
      const text = line.replace(/\s/g, '');
      return (
        !text.includes(HIGHLIGHT_COMMENT.START) &&
        !text.includes(HIGHLIGHT_COMMENT.END) &&
        !text.includes(HIGHLIGHT_COMMENT.NEXT_LINE)
      );
    })
    .join('\n');
};

export const CodeBlock: FC<Props> = props => {
  const { children, className, language = 'javascript' } = props;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    if (navigator.clipboard) {
      try {
        const code = removeCodeHighlightComments(children);
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="relative bg-[#fafafa] rounded-[0.5rem] pr-[36px] shadow-sm group">
      <Highlight theme={themes.oneLight} code={children} language={language}>
        {({
          className: highlightClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={clsx(
              'rounded-[0.5rem] overflow-auto',
              highlightClassName,
              className
            )}
            style={style}
          >
            <code className="p-[16px] inline-block w-full text-[14px] font-[500] font-['SourceCodePro']">
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                const shouldExclude = highlightLine(line, lineProps);
                const { className: lineClassName, ...restLineProps } =
                  lineProps;
                return !shouldExclude ? (
                  <div
                    key={i}
                    className={clsx(lineClassName, 'leading-[135%]')}
                    {...restLineProps}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ) : null;
              })}
            </code>
          </pre>
        )}
      </Highlight>
      <button
        className="absolute right-[10px] top-[10px] w-[28px] h-[28px] flex items-center justify-center text-gray-600 hover:bg-gray-500/10 hover:text-gray-950 rounded-md transition group-hover:opacity-100 opacity-0"
        onClick={handleCopyClick}
      >
        {isCopied ? (
          <CheckIcon size={16} className="text-green-600" />
        ) : (
          <CopyIcon size={16} />
        )}
      </button>
    </div>
  );
};
