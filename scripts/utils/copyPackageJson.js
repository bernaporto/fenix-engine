const { resolve } = require('path');
const { writeFileSync } = require('fs');

const copyPackageJson = (srcDirpath, outDirpath) => {
  const packageJsonPath = resolve(srcDirpath, 'package.json');
  const packageJsonOutPath = resolve(outDirpath, 'package.json');
  const packageJson = require(packageJsonPath);

  delete packageJson.private;
  delete packageJson.devDependencies;
  delete packageJson.scripts;

  writeFileSync(packageJsonOutPath, JSON.stringify(packageJson, null, 2));
};

module.exports = {
  copyPackageJson,
};
