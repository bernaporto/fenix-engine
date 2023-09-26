const { join, resolve } = require('path');
const { readdirSync } = require('fs');
const { isDirectory } = require('./utils/file');
const { transpile } = require('./transpile');

const srcDir = resolve(process.argv[2]);
const outDir = resolve(process.argv[3]);
const tsconfigPath = resolve(process.argv[4]);

readdirSync(srcDir)
  .filter((path) => isDirectory(join(srcDir, path)))
  .forEach((dirname) => {
    process.stdout.write(`Bundling ${dirname.toUpperCase()}... `);
    transpile(
      join(srcDir, dirname),
      resolve(outDir, dirname),
      resolve(tsconfigPath)
    );
    process.stdout.write('Done!\n');
  });

process.exit(0);
