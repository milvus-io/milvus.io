import { FC, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';
import { CopyIcon, CheckIcon } from 'lucide-react';

type Props = {
  children: string;
  language?: string;
  className?: string;
};

export const CodeBlock: FC<Props> = props => {
  const { children, className, language = 'javascript' } = props;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(children);
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
            <code className="p-[16px] inline-block">
              {tokens.map((line, i) => {
                const { className: lineClassName, ...restLineProps } =
                  getLineProps({ line });
                return (
                  <div
                    key={i}
                    className={clsx(lineClassName, 'leading-[135%]')}
                    {...restLineProps}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                );
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
