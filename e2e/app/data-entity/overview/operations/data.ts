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
 * @type {{description: string, defaultDataProvider: string, defaultNamespace: string,
 * tagTypeCode1: exports.data.tagTypeCode1, tagTypeCode2: exports.data.tagTypeCode2,
 * tagTypeCode3: exports.data.tagTypeCode3, bdefLongDescription: exports.data.bdefLongDescription,
 * bdefShortDescription: exports.data.bdefShortDescription,
 * bdefNoDescription: exports.data.bdefNoDescription,
 * bdefNoDisplayName: exports.data.bdefNoDisplayName}}
 */
import utils from '../../../../util/utils';

const uniqueId = utils.uniqueId();

export class Data {
  description = 'Sample description text for testing purpose. Used for all description fields';
  defaultDataProvider = 'DP_PROTRACTOR_TEST_OV' + uniqueId;
  defaultNamespace = 'NS_PROTRACTOR_TEST_OV' + uniqueId;

  tagTypeCode() {
    const tagTypeCode = {
      'code': 'Overview_TCclear' + uniqueId,
      'displayName': 'OC' + uniqueId,
      'order': '1',
      'tags': [
        {
          'code': 'TestOV1',
          'displayName': 'First Overview Tag',
          'parentCode': '',
          'bdefs': [
            {
              'name': 'bdefTest'
            }
          ]
        },
        {
          'code': 'TestOV2',
          'displayName': 'Second Overview Tag',
          'parentCode': '',
          'bdefs': [
            {
              'name': 'bdefTest'
            }
          ]
        }
      ]
    };
    return tagTypeCode;
  }

  bdefNoTagsNoSchema() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_TEST',
      'description': 'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
      'displayName': 'This is a display name of bef'
    };
  }

  bdefTest() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'BDEF_TEST_1',
      'description': 'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
      'displayName': 'Display name.. Protractor Bdef',
      'attributes': [
        {
          'name': 'test-attr-name',
          'value': 'test-attr-val'
        }
      ]
    };
  }

  // add the data prefix so each browser has a separate one to edit.
  editBdefTestData() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': utils.dataPrefix + 'BDEF_Edit_Desc_Frmt',
      'description': 'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
      'displayName': 'Edit Descriptive Information'
    };
  }

  formatTestEditDescriptiveFormat() {
    return {
      'namespace': this.editBdefTestData().namespace,
      'businessObjectDefinitionName': this.editBdefTestData().businessObjectDefinitionName,
      'businessObjectFormatUsage': 'PRC',
      'businessObjectFormatFileType': 'ORC',
      'partitionKey': 'TEST_KEY',
      'description': 'Nam et interdum quam, hendrerit varius magna.',
    };
  }

  formatTestEditDescriptiveFormat2() {
    return {
      'namespace': this.editBdefTestData().namespace,
      'businessObjectDefinitionName': this.editBdefTestData().businessObjectDefinitionName,
      'businessObjectFormatUsage': 'UPC',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY2',
      'description': 'Nam et interdum quam, hendrerit varius magna.',
    };
  }

  bdefTestMultipleFormatVersions() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'BDEF_TEST_1',
      'businessObjectFormatUsage': 'PRC',
      'businessObjectFormatFileType': 'ORC',
      'partitionKey': 'TEST_KEY',
      'description': 'Nam et interdum quam, hendrerit varius magna.',
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10'
          }
        ],
        'partitions': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10',
            'required': null,
            'defaultValue': null,
            'description': null
          }
        ]
      }
    };
  }

  bdefTestSingleFormatVersion() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'BDEF_TEST_1',
      'businessObjectFormatUsage': 'SRC',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': 'Nam et interdum quam, hendrerit varius magna.',
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '30'
          }
        ],
        'partitions': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '30',
            'required': null,
            'defaultValue': null,
            'description': null
          },
          {
            'name': 'TEST2_KEY',
            'type': 'VARCHAR',
            'size': null,
            'required': null,
            'defaultValue': null,
            'description': null
          },
          {
            'name': 'TEST3_KEY',
            'type': 'VARCHAR',
            'size': null,
            'required': null,
            'defaultValue': null,
            'description': null
          },
          {
            'name': 'TEST4_KEY',
            'type': 'VARCHAR',
            'size': null,
            'required': null,
            'defaultValue': null,
            'description': null
          },
          {
            'name': 'TEST5_KEY',
            'type': 'VARCHAR',
            'size': null,
            'required': null,
            'defaultValue': null,
            'description': null
          }
        ]
      }
    };
  }

  bdefSuggestion() {
    return {
      'businessObjectDefinitionDescriptionSuggestionKey': {
        'namespace': this.defaultNamespace,
        'businessObjectDefinitionName': 'BDEF_TEST',
        'userId': 'user123'
      },
      'descriptionSuggestion': 'protractor test suggestion'
    };
  }

}
