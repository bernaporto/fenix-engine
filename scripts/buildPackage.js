const { resolve } = require('path');

const { copyPackageJson } = require('./utils/copyPackageJson');
const { transpile } = require('./transpile');

const srcDir = resolve(process.argv[2]);
const outDir = resolve(process.argv[3]);
const tsconfigPath = resolve(process.argv[4]);

// transpile src to dist
transpile(srcDir, outDir, resolve(tsconfigPath));

// copy package.json from src to dist
copyPackageJson(srcDir, outDir);

process.exit(0);
