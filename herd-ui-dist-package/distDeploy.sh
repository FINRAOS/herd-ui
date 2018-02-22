# Copyright 2018 herd-ui contributors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#!/bin/bash
# Deploy `herd-ui-dist` to npm.
while getopts "r" flag
do
    case "$flag" in
        r)
        RELEASE="true"
        ;;
    esac
done

cd "$(dirname "$0")";

# Get UI version
UI_VERSION=$(node -p -e "require('../package.json').version");
DATE=`date '+%Y%m%d%H%M%S'`;

# Copy UI's dist files to our directory
echo "Copying dist files"
cp -r ../dist .;

if [ -z ${RELEASE} ]; then
  #RELEASE is unset so just publish beta

  echo "setting herd-ui-dist version to $UI_VERSION-beta.$DATE";
  # Replace our version placeholder with UI's version + beta appendix
  sed -i "s|\$\$VERSION|$UI_VERSION-beta.$DATE|g" package.json;

  echo "Publishing herd-ui-dist beta $UI_VERSION-beta.$DATE";
  npm publish --tag beta;
else 
  echo "setting herd-ui-dist version to $UI_VERSION";
  # Replace our version placeholder with UI's version
  sed -i "s|\$\$VERSION|$UI_VERSION|g" package.json;
  echo "Publishing herd-ui-dist latest $UI_VERSION";
  npm publish;
fi
