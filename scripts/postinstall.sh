$OUT_DIT=./dist

# clear output directory if it exists
if [ -d "$OUT_DIR" ]; then
  rm -rf $OUT_DIR
fi

# check if yarn is installed
if ! [ -x "$(command -v yarn)" ]; then
  echo 'Error: yarn is not installed.' >&2
  
  npm install -g yarn
fi

# for each folder inside ./packages run 'npm install' 'npm run build'
for package in ./packages/*; do
  if [ -d "$package" ]; then
    cd $package

    echo "Installing $package"

    yarn --ignore-scripts
    yarn build
    
    cd ../..
  fi
done

# Bundle packages using typescript compiler
echo "Bundling packages..."

node ./scripts/bundlePackages.js ./packages ./dist ./tsconfig.common.json

echo "Done bundling packages"

# Copy ./packages/ui/styles.css to ./dist/ui/styles.css
cp ./packages/ui/styles.css ./dist/ui/styles.css