const { consoleSandbox } = require('@sentry/utils');
const fs = require('fs');
const { join } = require('path');
const DOC_BASE_DIR = join(process.cwd(), './src/docs');
const PUBLIC_BASE_DIR = join(process.cwd(), './public/docs');
const VERSION_REGEX = /^v[1-9].*/;

const copyMkdAssetsToPublic = version => {
  const [baseSrcDir, baseTarDir] = [
    join(process.cwd(), `./src/docs/${version}/assets`),
    join(process.cwd(), `./public/docs/${version}/assets`),
  ];
  const copyPictures = (sourcePath, targetPath) => {
    const isDir = fs.statSync(sourcePath).isDirectory();

    if (isDir) {
      const paths = fs
        .readdirSync(sourcePath)
        .map(path => ({
          srcPath: `${sourcePath}/${path}`,
          tarPath: `${targetPath}/${path}`,
        }))
        .filter(v => !v.srcPath.includes('.DS_Store'));

      fs.mkdirSync(targetPath);
      paths.forEach(({ srcPath, tarPath }) => {
        copyPictures(srcPath, tarPath);
      });
    } else {
      const file = fs.readFileSync(sourcePath, 'binary');
      fs.writeFileSync(targetPath, file, 'binary');
    }
  };

  const paths = fs
    .readdirSync(baseSrcDir)
    .map(path => ({
      srcPath: `${baseSrcDir}/${path}`,
      tarPath: `${baseTarDir}/${path}`,
    }))
    .filter(v => !v.srcPath.includes('.DS_Store'));

  const isExist = fs.existsSync(baseTarDir);
  if (!isExist) {
    fs.mkdirSync(baseTarDir);
  } else {
    fs.rmSync(baseTarDir, {
      recursive: true,
      force: true,
    });
    fs.mkdirSync(baseTarDir);
  }
  paths.forEach(({ srcPath, tarPath }) => {
    copyPictures(srcPath, tarPath);
  });
};

const availableVersions = fs
  .readdirSync(DOC_BASE_DIR)
  .filter(v => VERSION_REGEX.test(v));

fs.rmSync(PUBLIC_BASE_DIR, {
  recursive: true,
  force: true,
});

fs.mkdirSync(join(process.cwd(), `./public/docs`));

availableVersions.forEach(v => {
  fs.mkdirSync(join(process.cwd(), `./public/docs/${v}`));
  fs.mkdirSync(join(process.cwd(), `./public/docs/${v}/assets`));

  copyMkdAssetsToPublic(v);
});
