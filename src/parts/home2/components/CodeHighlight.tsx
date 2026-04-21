import { useMemo } from 'react';
import { Highlight, themes, type PrismTheme } from 'prism-react-renderer';
import classes from './CodeHighlight.module.css';

type Props = {
  code: string;
  language?: string;
  className?: string;
};

// Dark theme tuned to the brutalist palette:
// - base background stays transparent so the host panel's bg shows through
// - keywords / functions pick up Milvus accent blue
// - strings are a muted lime, numbers warn-yellow, comments dim
const THEME: PrismTheme = {
  ...themes.vsDark,
  plain: {
    color: '#e6e6e6',
    backgroundColor: 'transparent',
  },
  styles: [
    ...themes.vsDark.styles,
    { types: ['keyword', 'builtin'], style: { color: '#00b3ff', fontWeight: 'bold' } },
    { types: ['function'], style: { color: '#00b3ff' } },
    { types: ['string', 'attr-value'], style: { color: '#c8e678' } },
    { types: ['number'], style: { color: '#faff00' } },
    { types: ['comment', 'prolog', 'doctype'], style: { color: '#6f7682', fontStyle: 'italic' } },
    { types: ['operator', 'punctuation'], style: { color: '#b8b8b8' } },
    { types: ['class-name', 'maybe-class-name'], style: { color: '#9cdcfe' } },
    { types: ['property'], style: { color: '#9cdcfe' } },
    { types: ['boolean', 'constant'], style: { color: '#faff00' } },
  ],
};

export default function CodeHighlight({ code, language = 'python', className }: Props) {
  const trimmed = useMemo(() => code.trim(), [code]);
  return (
    <Highlight code={trimmed} language={language} theme={THEME}>
      {({ className: hlClassName, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${classes.pre} ${hlClassName} ${className ?? ''}`}>
          {tokens.map((line, i) => (
            <div key={i} className={classes.line} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
