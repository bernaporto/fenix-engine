# VARIALBES:
PACKAGE_NAME=$1
PACKAGE_NAME_UPPER=$(echo $PACKAGE_NAME | tr '[:lower:]' '[:upper:]')

ROOT_DIR="$(pwd)"
SRC_DIR=$ROOT_DIR/packages/$PACKAGE_NAME
OUT_DIR=$ROOT_DIR/dist/$PACKAGE_NAME

# FUNCTIONS:
print() {
  message=$1
  overwrite=$2

  if [ "$overwrite" = true ]; then
    echo -e "\r\033[1A\033[0K$message";
  else
    echo $message;
  fi
}

quietCopy() {
  cp $1 $2 2>/dev/null || :
}

# PREPARE:
print "Preparing environment..."
# check if yarn is installed
if ! [ -x "$(command -v yarn)" ]; then
  echo 'Error: yarn is not installed.' >&2
  
  npm install -g yarn
fi

# install dependencies
yarn

# clear output directory if it exists
if [ -d "$OUT_DIR" ]; then
  rm -rf $OUT_DIR
fi

print "Preparing environment... done!" true

# BUILD:
print "Building $PACKAGE_NAME_UPPER..."

# Typescript compiler
node $ROOT_DIR/scripts/buildPackage.js $SRC_DIR $OUT_DIR $ROOT_DIR/tsconfig.common.json

print "Building $PACKAGE_NAME_UPPER... done!" true

# Copy files
print "Copying files..."

quietCopy $SRC_DIR/README.md $OUT_DIR/README.md
quietCopy $SRC_DIR/CHANGELOG.md $OUT_DIR/CHANGELOG.md
quietCopy $ROOT_DIR/.gitignore $OUT_DIR/.gitignore

print "Copying files... done!" true