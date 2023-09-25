const esbuild = require('esbuild');

const processFile = (filePath) =>
  esbuild.build({
    allowOverwrite: true,
    bundle: true,
    entryPoints: [filePath],
    outfile: filePath,
  });

module.exports = {
  processFile,
};
