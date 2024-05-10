# VARIABLES:
PACKAGE_NAME=$1
PACKAGE_NAME_UPPER=$(echo $PACKAGE_NAME | tr '[:lower:]' '[:upper:]')
REPO_NAME=fenix-engine-$PACKAGE_NAME

ACCESS_TOKEN=$2
BOT_USERNAME=$3

ROOT_DIR="$(pwd)"
SRC_DIR=$ROOT_DIR/dist/$PACKAGE_NAME
VERSION="$(node -p "require('$SRC_DIR/package.json').version")"

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

# PREPARE:
print "Preparing environment..."

# clone repo
git clone https://x-token-auth:$ACCESS_TOKEN@bitbucket.org/bernaporto/$REPO_NAME.git

# clear $REPO_NAME content
rm -rf $REPO_NAME/*

# copy $SRC_DIR content to $REPO_NAME
cp -R $SRC_DIR/* $REPO_NAME

print "Preparing environment... done!" true

cd $REPO_NAME

# CHECK:
# check if there are any changes
if [ -z "$(git status --porcelain)" ]; then
  print "No changes to publish. Aborting..." false
  exit 0
fi

# check if version tag already exists
if git rev-parse $VERSION >/dev/null 2>&1; then
  print "Version $VERSION already exists. Aborting..." false
  exit 0
fi


# PUBLISH:
print "Publishing $PACKAGE_NAME_UPPER..."

# push changes
git config user.name "bitbucket-publish-bot"
git config user.email "$BOT_USERNAME@bots.bitbucket.org"

git add -A
git commit -a -m "chore: publish @fenix-engine/$PACKAGE_NAME v$VERSION"
git tag $VERSION
git push origin master $VERSION

# cleanup
cd ..
rm -rf $REPO_NAME

print "Publishing $PACKAGE_NAME_UPPER... done!"
