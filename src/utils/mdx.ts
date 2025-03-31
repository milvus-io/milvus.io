import * as babel from '@babel/core';
import { compile } from '@mdx-js/mdx';
import traverse from '@babel/traverse';
import { visit } from 'unist-util-visit';
import { getBetaTagProperties, matchTitleBetaTag } from '@zilliz/toolkit';

function extractValue(node) {
  if (node.type === 'StringLiteral') {
    return node.value;
  } else if (node.type === 'NumericLiteral') {
    return node.value;
  } else if (node.type === 'ObjectExpression') {
    const obj = {};
    node.properties.forEach(prop => {
      const key = prop.key.name || prop.key.value;
      const value = extractValue(prop.value);
      obj[key] = value;
    });
    return obj;
  } else if (node.type === 'ArrayExpression') {
    return node.elements.map(el => extractValue(el));
  } else if (
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'FunctionExpression'
  ) {
    return 'Function';
  } else if (node.type === 'TemplateLiteral') {
    const quasis = node.quasis.map(quasi => quasi.value.raw);
    const expressions = node.expressions.map(expr => extractValue(expr));
    let result = '';
    for (let i = 0; i < quasis.length; i++) {
      result += quasis[i];
      if (i < expressions.length) {
        result += expressions[i];
      }
    }
    return result;
  } else if (node.type === 'Identifier') {
    return '${' + node.name + '}';
  } else if (node.type === 'BooleanLiteral') {
    return node.value;
  } else if (
    node.type === 'UnaryExpression' &&
    node.operator === '-' &&
    node.argument.type === 'NumericLiteral'
  ) {
    return -node.argument.value;
  } else {
    return 'Unknown type';
  }
}

export async function getVariablesFromMDX(mdxContent) {
  // Compile the MDX content into JSX
  const jsxCode = await compile(mdxContent);

  // Use Babel to parse the JSX into an AST
  const ast = babel.parse(jsxCode.value, {
    sourceType: 'module',
    presets: ['@babel/preset-react'],
  });

  const exports = {};

  // Traverse the AST and extract exports
  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration && path.node.declaration.declarations) {
        path.node.declaration.declarations.forEach(declaration => {
          const key = declaration.id.name;
          const value = extractValue(declaration.init); // Use extractValue helper
          exports[key] = value;
        });
      }
    },
  });

  return {
    exports,
  };
}

export const rehypeCodeBlockHighlightPlugin = () => {
  return tree => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'code' && parent.tagName === 'pre') {
        const codeBlockNode = {
          type: 'element',
          tagName: 'CodeBlock',
          children: node.children.map(item => {
            if (item.type === 'text') {
              item.value = item.value?.trim();
            }
            return item;
          }),
        };
        parent.children[index] = codeBlockNode;
      }
    });
  };
};

export const getRehypeHeadingTagPlugin =
  (params: { betaTag?: string }) => () => {
    const commonHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    const getTagElement = (tagCaption: string, tagColor: string) => {
      return {
        type: 'element',
        tagName: 'span',
        children: [{ type: 'text', value: tagCaption }],
        properties: {
          className: ['beta-tag'],
          style: `background-color:${tagColor};color:white`,
          translate: 'no',
        },
      };
    };

    return function (tree) {
      visit(tree, 'element', (node, index, parent) => {
        if (
          commonHeadings.includes(node.tagName) &&
          node.children &&
          node.children.length > 0
        ) {
          const content = node.children[0].value;
          const { matched, title, tagCaption, tagColor } =
            matchTitleBetaTag(content);
          if (matched) {
            node.children[0].value = title;
            node.children.push(getTagElement(tagCaption, tagColor));
          } else if (node.tagName === 'h1' && params.betaTag) {
            const { tagCaption, tagColor } = getBetaTagProperties(
              params.betaTag
            );
            node.children.push(getTagElement(tagCaption, tagColor));
          }
        }
      });
    };
  };
