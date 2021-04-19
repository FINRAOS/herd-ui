/*
* Copyright 2018 herd-ui contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import utils from '../../../../util/utils';

const uniqueId = utils.uniqueId();

export class Data {

  description = 'Sample description text for testing purpose. Used for all description fields';
  defaultDataProvider = 'BDEF_LIST_TEST_PROV' + uniqueId;
  defaultNamespace = 'BDEF_LIST_TEST_NS' + uniqueId;
  defaultBdefName = 'BDEF_LIST_TEST' + uniqueId;

  defaultBdef() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': this.defaultBdefName
    };
  }
}
