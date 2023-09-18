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
