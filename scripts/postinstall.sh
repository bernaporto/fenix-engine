# Get one level up from this script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )" && cd $DIR && cd ..
DIR="$(pwd)"
OUT_DIT=$DIR/dist

# clear output directory if it exists
if [ -d "$OUT_DIR" ]; then
  rm -rf $OUT_DIR
fi

# check if yarn is installed
if ! [ -x "$(command -v yarn)" ]; then
  echo 'Error: yarn is not installed.' >&2
  
  npm install -g yarn
fi

# Bundle packages using typescript compiler and local scripts
echo "Building packages..."

# Typescript compiler
node $DIR/scripts/bundlePackages.js $DIR/packages $DIR/dist $DIR/tsconfig.common.json

# Build UI styles
echo "Building UI styles..."

cd $DIR/packages/ui
yarn build:styles
cp $DIR/packages/ui/styles.css $DIR/dist/ui/styles.css

echo "Done bundling packages" && exit 0