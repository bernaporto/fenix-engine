# Link all packages
PACkAGE_NAMES=("core" "services" "ui" "utilities")

# for each package, link using yarn
for PACKAGE_NAME in ${PACkAGE_NAMES[@]}; do
  # link the package
  cd packages/$PACKAGE_NAME && yarn link && cd ../..
done