#!/bin/bash

echo "@fenix-engine | Running postinstall script..."

# Check if the script is running inside node_modules
CURR_PATH=$(pwd)
NODE_MODULES='node_modules'

if [[ "$CURR_PATH" == *"$NODE_MODULES"* ]]; then
  echo "@fenix-engine | Running inside node_modules..."

  # check if ./node_modules/@fenix-engine exists
  if [ -d "./node_modules/@fenix-engine" ]; then
    # copy @fenix-engine folder to root
    echo "@fenix-engine | Copying @fenix-engine folder to root..."

    cp -r ./node_modules/@fenix-engine ../

    echo "@fenix-engine | Done!"
    exit 0
  fi
fi

# else -> print message and exit
echo "@fenix-engine | Not running inside node_modules. Exiting..."
exit 0







