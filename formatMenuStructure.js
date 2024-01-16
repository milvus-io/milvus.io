const fs = require('fs');
const { join } = require('path');

const DOCS_DIR = join(process.cwd(), '/src/docs');
const VERSION_REGEX = /^v[1-9].*/;

const formatMenuStructure = list => {
  let newList = list.map(v => {
    const {
      id,
      title,
      isMenu = false,
      outLink = '',
      label1,
      label2,
      label3,
    } = v;

    const parentId = label3 || label2 || label1 || '';
    const parentIds = [label1, label2, label3].filter(v => !!v);
    const level = [label1, label2, label3].filter(v => !!v).length + 1;

    return {
      id: id,
      label: title,
      isMenu,
      outLink,
      parentId,
      parentIds,
      level,
      children: [],
    };
  });

  newList.sort((x, y) => y.level - x.level);

  const resultList = newList.slice();

  newList.forEach(v => {
    const { parentId, level, ...rest } = v;
    const parenetIndex = resultList.findIndex(v => v.id === parentId);
    if (parenetIndex !== -1) {
      resultList[parenetIndex].children.push(rest);
    }
  });

  return resultList
    .filter(v => v.level === 1)
    .map(v => {
      const { level, parentId, ...rest } = v;
      return {
        ...rest,
      };
    });
};

const versionsDocsDirs = fs
  .readdirSync(DOCS_DIR)
  .filter(v => VERSION_REGEX.test(v));

const docDirs = versionsDocsDirs.map(version => {
  const [enDocDir, cnDocDir] = [
    join(DOCS_DIR, `/${version}/site/en/menuStructure/en.json`),
    // join(DOCS_DIR, `/${version}/site/zh-CN/menuStructure/cn.json`),
  ];
  return {
    version,
    // cn: cnDocDir,
    en: enDocDir,
  };
});

// const path =
//   '/Users/artoo/projects/zilliz.com/src/docs/vectordb/v2.0.x/site/en/menuStructure/en.json';
// const content = JSON.parse(fs.readFileSync(path, 'utf-8'));
// const menuList =
//   Object.prototype.toString.call(content) === '[object Array]'
//     ? content
//     : content.menuList;
// const newStructure = formatMenuStructure(menuList);
// // console.log('newStructure---', newStructure);
// fs.writeFileSync(path, JSON.stringify({ menuList: newStructure }), 'utf-8');
// return;

docDirs.flat(Infinity).forEach(({ version, cn, en }) => {
  // const cnContent = JSON.parse(fs.readFileSync(cn, 'utf-8'));
  const enContent = JSON.parse(fs.readFileSync(en, 'utf-8'));
  // const cnMenuList =
  //   Object.prototype.toString.call(cnContent) === '[object Array]'
  //     ? cnContent
  //     : cnContent.menuList;

  const enMenuList =
    Object.prototype.toString.call(enContent) === '[object Array]'
      ? enContent
      : enContent.menuList;

  // const newStructureCn = formatMenuStructure(cnMenuList);
  const newStructureEn = formatMenuStructure(enMenuList);

  const data = JSON.parse(fs.readFileSync('./menu.json'));

  data[version] = {
    // cn: newStructureCn,
    en: newStructureEn,
  };

  fs.writeFileSync('./menu.json', JSON.stringify(data));

  // try {
  //   fs.writeFileSync(
  //     structurePath,
  //     JSON.stringify({ menuList: newStructure }),
  //     'utf-8'
  //   );
  // } catch (error) {
  //   console.log(structurePath + '---' + error);
  //   console.log('newStructure---', newStructure);
  // }
});
