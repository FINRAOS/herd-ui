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
export class Data {
  conf = require('./../../../../config/conf.e2e.json');

  description = 'Sample description text for testing purpose. Used for all description fields';
  defaultDataProvider = 'HERD_UI_SME_PROV';
  defaultNamespace = 'HERD_UI_SME_NS';
  userId1 = this.conf.smes[0].userId;
  userId2 = this.conf.smes[1].userId;

  defaultBdef () {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'HERD_UI_SME_TEST'
    };
  }
  badBdef () {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': 'HERD_UI_SME_PROV',
      'businessObjectDefinitionName': 'HERD_UI_SME_BAD'
    };
  }
  emptyBdef () {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'HERD_UI_SME_NONE'
    }
  }
}
