const { resolve } = require('path');
const ts = require('typescript');

const { compile } = require('./compile');
const { getFilesFromPath, isDirectory } = require('../utils/file');

const transpile = (src, outDir, tsconfigPath) => {
  const tsconfig = ts.readConfigFile(
    resolve(tsconfigPath),
    ts.sys.readFile
  ).config;
  const files = isDirectory(src)
    ? getFilesFromPath(src, 'ts', 'test.ts')
    : [src];

  compile(files, {
    ...tsconfig.compilerOptions,
    lib: [
      ...(tsconfig.compilerOptions.lib ?? []).map(
        (lib) => `lib.${lib.toLowerCase()}.d.ts`
      ),
    ],
    composite: true,
    declaration: true,
    declarationDir: outDir,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    outDir: outDir,
    target: ts.ScriptTarget.ES2015,
    paths: {
      'three/examples/*': [
        resolve('./node_modules/@types/three/examples/*'),
        resolve('./node_modules/three/examples/*'),
      ],
    },
  });
};

module.exports = {
  transpile,
};
