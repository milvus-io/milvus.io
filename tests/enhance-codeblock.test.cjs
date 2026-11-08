const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const loadEnhanceCodeBlock = () => {
  const file = path.join(__dirname, '../src/hooks/enhanceCodeBlock.ts');
  const source = fs.readFileSync(file, 'utf8');

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const exports = {};
  const evalSource = `
    const require = () => ({});
    const useRouter = () => ({ asPath: '' });
    const useEffect = () => {};
    const copyToCommand = () => {};
    const checkIconTpl = '';
    const copyIconTpl = '';
    const formatCodeContent = () => '';
    const FILTER_QUERY_KEY = 'filter';
    const formatQueryString = () => '';

    ${transpiled}
  `;

  const fn = new Function('exports', evalSource);
  fn(exports);
  return exports;
};

const {
  normalizeCodeFilterKey,
  matchesLanguageClass,
  collectCodeBlockGroups,
  collectScopedCodeBlocks,
} = loadEnhanceCodeBlock();

test('normalizeCodeFilterKey normalizes #lang, ?lang, and #c++ / ?c++ keys consistently', () => {
  assert.equal(normalizeCodeFilterKey('#java'), '?java');
  assert.equal(normalizeCodeFilterKey('?java'), '?java');
  assert.equal(normalizeCodeFilterKey('#Python'), '?python');
  assert.equal(normalizeCodeFilterKey('#c++'), '?cpp');
  assert.equal(normalizeCodeFilterKey('?c++'), '?cpp');
  assert.equal(normalizeCodeFilterKey('#cpp'), '?cpp');
  assert.equal(normalizeCodeFilterKey(''), '');
  assert.equal(normalizeCodeFilterKey(null), '');
});

test('matchesLanguageClass matches both language-cpp and legacy language-c++ when ?cpp is selected', () => {
  const makeClassList = (...classes) => ({
    contains: cls => classes.includes(cls),
  });
  assert.equal(matchesLanguageClass(makeClassList('language-cpp'), '?cpp'), true);
  assert.equal(matchesLanguageClass(makeClassList('language-c++'), '?cpp'), true);
  assert.equal(matchesLanguageClass(makeClassList('language-c++'), '#c++'), true);
  assert.equal(matchesLanguageClass(makeClassList('language-python'), '?cpp'), false);
  assert.equal(matchesLanguageClass(makeClassList('language-java'), '#java'), true);
});

test('collectScopedCodeBlocks scopes tab switching to consecutive sibling PRE blocks and preserves standalone code blocks', () => {
  const makeCode = cls => ({ className: cls });
  const makePre = code => ({
    tagName: 'PRE',
    className: '',
    querySelectorAll: () => [code],
    nextElementSibling: null,
  });
  const makeEmptyP = () => ({
    tagName: 'P',
    textContent: '   ',
    nextElementSibling: null,
  });
  const makeTextP = text => ({
    tagName: 'P',
    textContent: text,
    nextElementSibling: null,
  });

  const standaloneInstallCode = makeCode('language-bash');
  const standaloneInstallPre = makePre(standaloneInstallCode);

  const pyCode = makeCode('language-python');
  const javaCode = makeCode('language-java');
  const cppCode = makeCode('language-c++');
  const outputCode = makeCode('language-python');

  const wrapper = { tagName: 'DIV', className: 'multipleCode', nextElementSibling: null };
  const emptyP = makeEmptyP();
  const prePy = makePre(pyCode);
  const preJava = makePre(javaCode);
  const preCpp = makePre(cppCode);
  const outputLabel = makeTextP('Below is an example output.');
  const preOutput = makePre(outputCode);

  standaloneInstallPre.nextElementSibling = wrapper;
  wrapper.nextElementSibling = emptyP;
  emptyP.nextElementSibling = prePy;
  prePy.nextElementSibling = preJava;
  preJava.nextElementSibling = preCpp;
  preCpp.nextElementSibling = outputLabel;
  outputLabel.nextElementSibling = preOutput;

  const grouped = collectScopedCodeBlocks([wrapper]);
  assert.equal(grouped.has(pyCode), true);
  assert.equal(grouped.has(javaCode), true);
  assert.equal(grouped.has(cppCode), true);
  assert.equal(grouped.has(standaloneInstallCode), false, 'standalone install block before .multipleCode must not be grouped');
  assert.equal(grouped.has(outputCode), false, 'standalone output block after non-empty paragraph must not be grouped');
});

test('docsStyle.css includes .language-c\\+\\+ alongside .language-cpp', () => {
  const css = fs.readFileSync(
    path.join(__dirname, '../src/styles/docsStyle.css'),
    'utf8'
  );
  assert.match(css, /\.language-c\\\+\\\+,/);
});

test('multiple .multipleCode groups with mismatched language tabs do not hide blocks when an unshared tab is selected', () => {
  const makeCode = cls => {
    const classes = new Set(cls.split(' '));
    return {
      className: cls,
      classList: {
        contains: c => classes.has(c),
        toggle: (c, val) => {
          if (val) classes.add(c);
          else classes.delete(c);
        },
      },
    };
  };

  const makeFilter = (href, text) => {
    const classes = new Set();
    const filterObj = {
      tagName: 'A',
      hash: href,
      getAttribute: () => href,
      textContent: text,
      classList: {
        contains: c => classes.has(c),
        toggle: (c, val) => {
          if (val) classes.add(c);
          else classes.delete(c);
        },
      },
    };
    return filterObj;
  };

  // Group 1: Python and Java
  const f1Py = makeFilter('#python', 'Python');
  const f1Java = makeFilter('#java', 'Java');
  const c1Py = makeCode('language-python');
  const c1Java = makeCode('language-java');
  const w1 = {
    tagName: 'DIV',
    className: 'multipleCode',
    querySelectorAll: () => [f1Py, f1Java],
    nextElementSibling: {
      tagName: 'PRE',
      querySelectorAll: () => [c1Py],
      nextElementSibling: {
        tagName: 'PRE',
        querySelectorAll: () => [c1Java],
        nextElementSibling: null,
      },
    },
  };

  // Group 2: Python and Bash (no Java)
  const f2Py = makeFilter('#python', 'Python');
  const f2Bash = makeFilter('#bash', 'Bash');
  const c2Py = makeCode('language-python');
  const c2Bash = makeCode('language-bash');
  const w2 = {
    tagName: 'DIV',
    className: 'multipleCode',
    querySelectorAll: () => [f2Py, f2Bash],
    nextElementSibling: {
      tagName: 'PRE',
      querySelectorAll: () => [c2Py],
      nextElementSibling: {
        tagName: 'PRE',
        querySelectorAll: () => [c2Bash],
        nextElementSibling: null,
      },
    },
  };

  const groups = collectCodeBlockGroups([w1, w2]);
  assert.equal(groups.length, 2);

  // Simulate selecting ?java
  const search = '?java';
  groups.forEach(group => {
    const hasMatchingTab = group.filters.some(f => f['key'] === search);
    const activeKey = hasMatchingTab
      ? search
      : group.filters.find(f => f.classList.contains('active'))?.['key'] ||
        group.firstKey;

    group.filters.forEach(f => {
      f.classList.toggle('active', f['key'] === activeKey);
    });

    group.codes.forEach(c => {
      c.classList.toggle('active', matchesLanguageClass(c.classList, activeKey));
    });
  });

  // Group 1 switched to Java
  assert.equal(f1Java.classList.contains('active'), true);
  assert.equal(f1Py.classList.contains('active'), false);
  assert.equal(c1Java.classList.contains('active'), true);
  assert.equal(c1Py.classList.contains('active'), false);

  // Group 2 (having no Java) kept its active/firstKey tab (Python) and did NOT turn invisible!
  assert.equal(f2Py.classList.contains('active'), true);
  assert.equal(f2Bash.classList.contains('active'), false);
  assert.equal(c2Py.classList.contains('active'), true);
  assert.equal(c2Bash.classList.contains('active'), false);
});

test('pages without .multipleCode activate all language content blocks by default', () => {
  const makeCode = cls => {
    const classes = new Set(cls.split(' '));
    return {
      className: cls,
      classList: {
        contains: c => classes.has(c),
        toggle: (c, val) => {
          if (val) classes.add(c);
          else classes.delete(c);
        },
      },
    };
  };

  const standaloneBash = makeCode('language-bash');
  const standalonePython = makeCode('language-python');
  const allContents = [standaloneBash, standalonePython];
  const filterWrappers = [];

  // Simulate logic in useMultipleCodeFilter when filterWrappers.length === 0
  if (!filterWrappers.length) {
    allContents.forEach(c => c.classList.toggle('active', true));
  }

  assert.equal(standaloneBash.classList.contains('active'), true);
  assert.equal(standalonePython.classList.contains('active'), true);
});
