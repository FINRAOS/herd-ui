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
 * Use this data in specs.
 * @type {{}}
 */

export class Data {
  public namespace = 'PERFDATASEARCH';
  public dataProviderName = 'PERFDATA';
  public description = 'Sample description text for testing purpose. Used for data-objects detail screen';
  public defaultDataProvider = this.dataProviderName;
  public defaultNamespace = this.namespace;
  public bdef = {
    'namespace': this.namespace,
    'dataProviderName': this.dataProviderName,
    'businessObjectDefinitionName': 'PERFDATA',
    'description': 'Description of the bdef',
    'displayName': 'DATA FOR TESTING BDATA DETAIL'
  }


  public formatWithSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': 'SRC',
    'businessObjectFormatFileType': 'TXT',
    'partitionKey': 'TEST_KEY',
    'schema': {
      'nullValue': 'NULL',
      'delimiter': '|',
      'escapeCharacter': '\\',
      'columns': [
        {
          'name': 'TRADE_ID',
          'type': 'VARCHAR'
        }
      ],
      'partitions': [
        {
          'name': 'TEST_KEY',
          'type': 'VARCHAR'
        },
        {
          'name': 'TEST1_KEY',
          'type': 'VARCHAR'
        },
        {
          'name': 'EMPLOYEE_KEY',
          'type': 'VARCHAR'
        },
        {
          'name': 'DATA_KEY',
          'type': 'VARCHAR'
        },
        {
          'name': 'FIRM_KEY',
          'type': 'VARCHAR'
        }
      ]
    }
  }

  public formatWithSubpartitionsPerfData = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': 'SRC',
    'businessObjectFormatFileType': 'TXT',
    'partitionKey': 'TEST_KEY',
    'schema': {
      'nullValue': 'NULL',
      'delimiter': '|',
      'escapeCharacter': '\\',
      'columns': [
        {
          'name': 'TRADE_ID',
          'type': 'VARCHAR'
        }
      ],
      'partitions': [
        {
          'name': 'PERFKEY',
          'type': 'VARCHAR'
        },
        {
          'name': 'PERKEY10002',
          'type': 'VARCHAR'
        }
      ]
    }
  }


  public formatWithNoSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': 'DDLDATA',
    'businessObjectFormatFileType': 'TXT',
    'partitionKey': 'PERFKEY',
    'schema': {
      'nullValue': 'NULL',
      'delimiter': '|',
      'escapeCharacter': '\\',
      'columns': [
        {
          'name': 'TRADE_ID',
          'type': 'VARCHAR'
        }
      ],
      'partitions': [
        {
          'name': 'TEST_KEY',
          'type': 'VARCHAR'
        }
      ]
    }
  }
  public bdataWithoutSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'Dog',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc' +
        '/orc/data-lineage-test/schm-v0/data-v0/test-key=Dog'
      }
    }]
  }
  public bdataWithSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithSubpartitions.partitionKey,
    'partitionValue': 'Bird',
    'status': 'VALID',
    'subPartitionValues': ['TWO', 'THREE', 'Four', 'five'],
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/src' +
        '/txt/data-lineage-test/schm-v0/data-v0/test-key=Bird/test1-key=TWO/employee-key=THREE/data-key=Four/firm-key=five'
      }
    }]
  }
  public versionTestV0 = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'versionTest',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/' +
        'prc/orc/data-lineage-test/schm-v0/data-v0/test-key=versionTest'
      }
    }]
  }
  public versionTestV1 = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'PERKEY10002',
    'status': 'VALID',
    'createNewVersion': 'true',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc' +
        '/orc/data-lineage-test/schm-v0/data-v1/test-key=versionTest'
      }
    }]
  }
  public versionTestV2 = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'PERKEY10002',
    subPartitionValues: ['test1', 'thing2'],
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc' +
        '/orc/data-lineage-test/schm-v0/data-v2/test-key=versionTest'
      }
    }],
    'attributes': [{
      'name': 'totalRowCount',
      'value': '3'
    },
      {
        'name': 'updateTS',
        'value': '20160815 11:38:39'
      }],
    'createNewVersion': 'true'
  }

}
