const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const ignoreFile = (file, ignorePattern) =>
  ignorePattern ? file.match(ignorePattern) : false;

const getFilesFromPath = (root, extension, ignorePattern) =>
  readdirSync(root, { recursive: true })
    .flatMap((subpath) => {
      const path = join(root, subpath);

      if (statSync(path).isDirectory()) {
        return getFilesFromPath(path, extension);
      }

      return path;
    })
    .filter(
      (file) =>
        file.match(new RegExp(`.*\.(${extension})$`)) &&
        !ignoreFile(file, ignorePattern)
    );

const isDirectory = (filepath) => statSync(filepath).isDirectory();

module.exports = {
  getFilesFromPath,
  isDirectory,
};
