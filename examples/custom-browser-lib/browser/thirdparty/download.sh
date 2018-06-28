#!/usr/bin/env bash

set -e

mkdir -p semantic-ui-2.1.8/
pushd semantic-ui-2.1.8/

curl -O https://oss.maxcdn.com/semantic-ui/2.1.8/semantic.min.css
curl -O https://oss.maxcdn.com/semantic-ui/2.1.8/semantic.min.js

mkdir -p themes/default/assets/fonts/
pushd themes/default/assets/fonts/
for ext in eot otf svg ttf woff woff2; do
  curl -O https://rawgit.com/Semantic-Org/Semantic-UI-CSS/2.1.8/themes/default/assets/fonts/icons.$ext
done
popd

mkdir -p themes/default/assets/images/
pushd themes/default/assets/images/
curl -O https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-CSS/2.1.8/themes/default/assets/images/flags.png
popd

popd

mkdir -p jquery-3.1.1/
pushd jquery-3.1.1/
curl -O https://code.jquery.com/jquery-3.1.1.min.js
popd
