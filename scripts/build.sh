#!/bin/bash

echo "Cleaning build space ..."

shopt -s extglob
rm -Rf !(scripts) .gitignore .travis.yml

function addFile() {
    #$1:file
    cp --parents $1 ../../
}
export -f addFile

echo "Getting webapp..."
git clone https://github.com/adentes-org/SOFIA.git "web-app/" && cd web-app

echo "Linking dependances if exist..."

if [ ! -d "$TRAVIS_BUILD_DIR/node_modules" ]; then
  ln -s "$TRAVIS_BUILD_DIR/node_modules" "node_modules"
fi

if [ ! -d "$TRAVIS_BUILD_DIR/bower_components" ]; then
  ln -s "$TRAVIS_BUILD_DIR/bower_components" "bower_components"
fi

echo "Building webapp..."
npm install && bower-installer && gulp
cd www

addFile index.html

#find assets -type f -name '*.html' -exec  bash -c 'addFile "$0"' {} \;
find assets -type f -name '*.tmpl' -exec  bash -c 'addFile "$0"' {} \;
find assets/img -type f -name '*.png' -exec  bash -c 'addFile "$0"' {} \;

find dist -type f -name '*.js' -exec  bash -c 'addFile "$0"' {} \;
find dist -type f -name '*.css' -exec bash -c 'addFile "$0"' {} \;

echo "Removing base repo"
cd ../.. && rm -Rf web-app
