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
#usage ./run-in-saucelab.sh

echo "Installing npm packages..."
npm install

echo "Running Functianal tests..."
node_modules/protractor/bin/protractor protractor.conf.ci.js

echo "--- Printing Set Environemnt Variables ---"
printenv
echo "--- Printing Done ---"

echo "slack.properties is equal to..."
cat slack.properties
echo "done printing slack.properties"

