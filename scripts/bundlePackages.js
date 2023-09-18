const { join, resolve } = require('path');
const { readdirSync } = require('fs');
const { isDirectory } = require('./utils/file');
const { bundle } = require('./bundle');

const srcDir = resolve(process.argv[2]);
const outDir = resolve(process.argv[3]);
const tsconfigPath = resolve(process.argv[4]);

readdirSync(srcDir)
  .filter((path) => isDirectory(join(srcDir, path)))
  .forEach((dirname) => {
    console.log(`Bundling ${dirname}...`);
    bundle(
      join(srcDir, dirname),
      resolve(outDir, dirname),
      resolve(tsconfigPath)
    );
    console.log('Done!');
  });
