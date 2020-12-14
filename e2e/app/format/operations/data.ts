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
 * **/
const conf = require('./../../../config/conf.e2e.json');
import utils from '../../../util/utils';

const uniqueId = utils.uniqueId();

export class Data {
  description = 'Sample description text for testing purpose. Used for all description fields';
  documentSchema = 'Sample document schema';
  defaultDataProvider = 'DP_PROTRACTOR_TEST' + uniqueId;
  defaultNamespace = 'NS_PROTRACTOR_TEST' + uniqueId;

  bdef1() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'description': this.description
    };
  }

  bdef2() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': 'FORMAT_DETAILS_PLUS',
      'description': this.description
    };
  }

  formatNoData() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS_PLUS',
      'businessObjectFormatUsage': 'XCX',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY'
    };
  }

  bformat1() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_A',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FORMAT_DETAIL_PG',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10',
            'required': 'false',
            'defaultValue': 'ABC',
            'description': 'this is a test column'
          },
          {
            'name': 'TEST2_KEY',
            'type': 'NUMBER',
            'size': '8',
            'required': 'false',
            'defaultValue': '2',
            'description': 'this is another test column'
          }
        ],
        'partitions': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '20',
            'required': 'true',
            'defaultValue': 'XYZ',
            'description': 'this is a test partition'
          },
          {
            'name': 'TEST2_KEY',
            'type': 'VARCHAR',
            'size': '5',
            'required': 'true',
            'defaultValue': 'OOPS',
            'description': 'this is another test partition'
          }
        ]
      }
    };

  }

  bformat2() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_B',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'documentSchema': this.documentSchema
    };
  }

  bformat21() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_B',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': 'second version',
      'documentSchema': this.documentSchema,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FORMAT_DETAIL_PG',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10',
            'required': 'false',
            'defaultValue': 'ABC',
            'description': 'this is a test column'
          },
          {
            'name': 'TEST2_KEY',
            'type': 'NUMBER'
          }
        ]
      },
      'attributes': [
        {
          'name': 'name1',
          'value': 'value1'
        },
        {
          'name': 'name2',
          'value': 'value2'
        }

      ],
      'attributeDefinitions': [
        {
          'name': 'attr1',
          'publish': true
        },
        {
          'name': 'attr2',
          'publish': false
        }
      ]
    };
  }

  bformat3() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_C',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FORMAT_DETAIL_PG',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10',
            'required': 'false',
            'defaultValue': 'ABC',
            'description': 'this is a test column'
          }
        ],
        'partitions': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '20',
            'required': 'true',
            'defaultValue': 'XYZ',
            'description': 'this is a test partition'
          },
          {
            'name': 'TEST2_KEY',
            'type': 'NUMBER'
          }
        ]
      }
    };
  }

  bformat4() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_D',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FORMAT_DETAIL_PG',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10',
            'required': 'false',
            'defaultValue': 'ABC',
            'description': 'this is a test column'
          },
          {
            'name': 'TEST2_KEY',
            'type': 'NUMBER'
          }
        ]
      }
    };
  }

  bformat5() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_E',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FIFTY_CHARACTERS_LONG_AAABBBBBCCCCCDDDDDEEEEEAAAAA',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '10',
            'required': 'false',
            'defaultValue': 'ABC',
            'description': 'this is a test column'
          }
        ]
      }
    };
  }

  bformat6() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_F',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FORMAT_DETAIL_PG',
        'columns': [
          {
            'name': 'J26f5qDxUxgZomUukYnX8n7TK4iObISPuJ39TkU9WP0GTRH2B99vM9R2oww13Leci26BCxg5nAKy42Qc1BzcHL55L6UH2uqUvTq8',
            'type': 'R9SVRjlDMmjQjMRYGwDssEXhIJsopkOhKGntAbbX',
            'size': '6PeVGkCNot',
            'required': 'false',
            'defaultValue': 'rQ7tA3OMKOJLi3AOeQZHkjGujKbTsnnmLNVLWCbMxu3xa1Ipx0',
            'description': this.description
          }
        ],
        'partitions': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'size': '20',
            'required': 'true',
            'defaultValue': 'XYZ',
            'description': 'this is a test partition'
          },
          {
            'name': 'J26f5qDxUxgZomUukYnX8n7TK4iObISPuJ39TkU9WP0GTRH2B99vM9R2oww13Leci26BCxg5nAKy42Qc1BzcHL55L6UH2uqUvTq7',
            'type': 'R9SVRjlDMmjQjMRYGwDssEXhIJsopkOhKGntAbbX',
            'size': '6PeVGkCNot',
            'required': 'true',
            'defaultValue': 'rQ7tA3OMKOJLi3AOeQZHkjGujKbTsnnmLNVLWCbMxu3xa1Ipx0',
            'description': this.description
          }
        ]
      }
    };
  }

  bformat7() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS_PLUS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': this.description,
      'schema': {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'partitionKeyGroup': 'FORMAT_DETAIL_PG',
        'columns': [
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'description': 'this is a test column'
          },
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR'
          },
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'description': 'this is another test column'
          },
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR'
          },
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR',
            'description': 'this is another test column'
          },
          {
            'name': 'TEST_KEY',
            'type': 'VARCHAR'
          }
        ]
      }
    };
  }

  bFormatRelationalTable() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_F',
      'businessObjectFormatFileType': 'RELATIONAL_TABLE',
      'relationalSchemaName': 'rel_schema_name',
      'relationalTableName': 'rel_table_name'
    }
  }

  bdata1() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_A',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_1',
      'status': 'VALID',
      'subPartitionValues': ['BIRD'],
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/format-details-a/txt/' +
            'format-details/schm-v0/data-v0/test-key=TEST_1/' + conf.mmodule + '=BIRD'
        }
      }],
      'documentSchema': this.documentSchema
    };
  }

  bdata2() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_B',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_1',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/format-details-b/' +
            'txt/format-details/schm-v0/data-v0/test-key=TEST_1'
        }
      }]
    };
  }

  bdata3() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_B',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_2',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/format-details-b/txt/' +
            'format-details/schm-v0/data-v0/test-key=TEST_2'
        }
      }]
    };
  }

  bdata4() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_C',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_1',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/' +
            'format-details-c/txt/format-details/schm-v0/data-v0/test-key=TEST_1'
        }
      }]
    };
  }

  bdata5() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_D',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_1',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/' +
            'format-details-d/txt/format-details/schm-v0/data-v0/test-key=TEST_1'
        }
      }]
    };
  }

  bdata6() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_E',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_2',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/' +
            'format-details-e/txt/format-details/schm-v0/data-v0/test-key=TEST_2'
        }
      }]
    };
  }

  bdata7() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_F',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_1',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/' +
            'format-details-f/txt/format-details/schm-v0/data-v0/test-key=TEST_1'
        }
      }]
    };
  }

  bdata8() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS_PLUS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_1',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/' +
            'format-details/txt/format-details-plus/schm-v0/data-v0/test-key=TEST_1'
        }
      }]
    };
  }

  bdata21() {
    return {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': 'FORMAT_DETAILS',
      'businessObjectFormatUsage': 'FORMAT_DETAILS_B',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 1,
      'partitionKey': 'TEST_KEY',
      'partitionValue': 'TEST_21',
      'status': 'VALID',
      'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
          'directoryPath': 'ns-protractor-test/dp-protractor-test/format-details-b/txt/' +
            'format-details/schm-v1/data-v0/test-key=TEST_21'
        }
      }]
    };
  }
}
