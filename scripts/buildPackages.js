const { join, resolve } = require('path');
const { readdirSync } = require('fs');

const { copyPackageJson } = require('./utils/copyPackageJson');
const { isDirectory } = require('./utils/file');
const { transpile } = require('./transpile');

const srcDir = resolve(process.argv[2]);
const outDir = resolve(process.argv[3]);
const tsconfigPath = resolve(process.argv[4]);

readdirSync(srcDir)
  .filter((path) => isDirectory(join(srcDir, path)))
  .forEach((dirname) => {
    process.stdout.write(`Bundling ${dirname.toUpperCase()}... `);

    const srcDirpath = resolve(srcDir, dirname);
    const outDirpath = resolve(outDir, dirname);

    transpile(srcDirpath, outDirpath, resolve(tsconfigPath));

    // copy package.json from src to dist
    copyPackageJson(srcDirpath, outDirpath);

    process.stdout.write('Done!\n');
  });

process.exit(0);
