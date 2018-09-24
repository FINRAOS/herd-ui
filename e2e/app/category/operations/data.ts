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

/**
 * This file maintains all the data to be posted to HERD and validated against in tests.
 * Use this data in specs. DO NOT HARD-CODE DATA IN SPECS
 * @types description: string, defaultDataProvider: string, defaultNamespace: string,
 * tagTypeCode1: exports.data.tagTypeCode1, tagTypeCode2: exports.data.tagTypeCode2, tagTypeCode3:
 * exports.data.tagTypeCode3, bdefLongDescription: exports.data.bdefLongDescription,
 * bdefShortDescription: exports.data.bdefShortDescription, bdefNoDescription: exports.data.bdefNoDescription,
 * bdefNoDisplayName: exports.data.bdefNoDisplayName}}
 */

export class Data {

  description = 'Sample description text for testing purpose. Used for all description fields';
  defaultDataProvider = 'DP_PROTRACTOR_TEST_TAG';
  defaultNamespace = 'NS_PROTRACTOR_TEST_TAG';

  tagTypeCode() {
    const tagTypeCode = {
      'code': 'Bb_Test_CTGRY',
      'displayName': 'Bb Test3 Category',
      'order': '-1',
      'tags': [
        {
          'code': 'FORD',
          'displayName': 'Ford Company',
          'parentCode': '',
          'bdefs': [
            {
              'name': 'bdefLongDescription'
            }
          ]
        }, {
          'code': 'TestTag1',
          'displayName': 'Test Tag1 Company',
          'parentCode': '',
          'bdefs': []
        }, {
          'code': 'TestTag2',
          'displayName': 'Test Tag2 Company',
          'parentCode': '',
          'bdefs': [
            {
              'name': 'bdefNoDisplayName'
            }
          ]
        }, {
          'code': 'SEDAN',
          'displayName': 'Sedan Model Cars',
          'parentCode': 'FORD',
          'bdefs': [
            {
              'name': 'bdefShortDescription'
            },
            {
              'name': 'bdefNoDescription'
            }
          ]

        }, {
          'code': 'FORD_FUSION',
          'displayName': 'Famous Ford Fusion',
          'parentCode': 'SEDAN',
          'bdefs': [{
            'name': 'bdefNoDescription'
          }]
        }
      ]
    };
    return tagTypeCode;
  }

  tagTypeCode2() {
    const tagTypeCode = {
      'code': 'CC_Test_CTGRY',
      'displayName': 'CC Test42 Category',
      'order': '-2',
      'tags': [
        {
          'code': 'LORD',
          'displayName': 'LORD Company',
          'parentCode': '',
          'bdefs': [
            {
              'name': 'bdefLongDescription'
            }, {
              'name': 'lordUniqueBdef'
            }, {
              'name': 'bdefNoDisplayName'
            }
          ]
        }
      ]
    };
    return tagTypeCode;
  }

  tagTypeCode3() {
    const tagTypeCode = {
      'code': 'DD_bdef_CTGRY',
      'displayName': 'DD bdef Category',
      'order': '0',
      'tags': [
        {
          'code': 'LORD_1',
          'displayName': 'LORD Company_1',
          'parentCode': '',
          'bdefs': [
            {
              'name': 'lordUniqueBdef'
            }
          ]
        }
      ]
    };
    return tagTypeCode;
  }

  bdefLongDescription() {
    const bdef = {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_TEST_LONG_DESC',
      'description': this.description,
      'displayName': 'This is a display name of bef with long desc'
    };
    return bdef;
  }

  bdefShortDescription() {
    const bdef = {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_TEST_SHORT_DESC',
      'description': 'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
      'displayName': 'This is a bef with short desc'
    };
    return bdef;
  }

  bdefNoDescription() {
    const bdef = {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_TEST_NO_DESC',
      'displayName': 'This is a bef with no desc'
    };
    return bdef;
  }

  bdefNoDisplayName() {
    const bdef = {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_NO_DISPLAY_NAME',
      'description': ''
    };
    return bdef;
  }

  lordUniqueBdef() {
    const bdef = {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_LORD_UNIQUE'
    };
    return bdef;
  }
}
