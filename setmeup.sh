#!/bin/bash

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

## script to auto-load code-style and inspection profile (for *nix systems)

function code_style_setup() {
  cp "./.code-style-intellij/codeStyleConfig.xml" "./.idea/codeStyles/codeStyleConfig.xml"
  cp "./.code-style-intellij/udc-code-style.xml" "./.idea/codeStyles/Project.xml"
}

function inspection_profile_setup() {
  cp "./.code-style-intellij/inspection-profile.xml" "./.idea/inspectionProfiles/Project_Default.xml"
}

# setup code-style
if [ -d "./.idea/codeStyles" ]; then
  printf "\nRemoving existing code-style, will setup the preferred code-style."
  rm -rf "./.idea/codeStyles"
  mkdir -p "./.idea/codeStyles"
else
  printf "\nNo code-style currently defined, will setup the preferred code-style."
fi
code_style_setup

# setup inspection-profile
if [ -d "./.idea/inspectionProfiles" ]; then
  printf "\nRemoving existing inspection profile, will setup the preferred profile."
  rm -rf "./.idea/inspectionProfiles"
  mkdir -p "./.idea/inspectionProfiles"
else
  printf "\nNo inspection profile currently defined, will setup the preferred profile."
fi
inspection_profile_setup

printf "\nDone setting up"
