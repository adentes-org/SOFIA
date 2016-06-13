#!/bin/bash

echo "Cleaning build space ..."

shopt -s extglob
rm -Rf !(scripts)

function addFile() {
    #$1:file
    cp --parents $1 ../../
}
export -f addFile

echo "Getting webapp..."
git clone https://github.com/adentes-org/SOFIA.git "web-app/" && cd web-app

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
