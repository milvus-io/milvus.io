const fs = require('fs');
const { join } = require('path');
const BASE_DIR = join(process.cwd(), './src/docs');
const AVAILABLE_VERSIONS = ['v1', 'v2'];

const copyMkdAssetsToPublic = version => {
  const [baseSrcDir, baseTarDir] = [
    join(process.cwd(), `./src/docs/${version}/assets`),
    join(process.cwd(), `./public/${version}/assets`),
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
  .readdirSync(BASE_DIR)
  .filter(v => AVAILABLE_VERSIONS.some(i => v.includes(i)));

availableVersions.forEach(v => {
  copyMkdAssetsToPublic(v);
});
