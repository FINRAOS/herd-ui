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
  public dataProviderName = 'DP_PROTRACTOR_TEST_DL42';
  public namespace = 'NS_PROTRACTOR_TEST_DL42';
  public defaultNamespace = this.namespace;
  public description = 'Sample description text for testing purpose. ' +
  'Used for data-objects detail screen to test lineage functionality';
  public defaultDataProvider = this.dataProviderName;

  public bdef = {
    'namespace': this.namespace,
    'dataProviderName': this.dataProviderName,
    'businessObjectDefinitionName': 'DATA_LINEAGE_TEST',
    'description': 'Description of the bdef',
    'displayName': 'DATA FOR TESTING BDATA DETAIL'
  };
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
  };

  public formatWithNoSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': 'PRC',
    'businessObjectFormatFileType': 'ORC',
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
        }
      ]
    }
  };

  public bdataParentWithoutSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'Dog',
    'subPartitionValues': ['Juliet', 'Mercutio', 'Tybalt', 'Benvolio'],
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=Dog'
      }
    }]
  };

  public bdataParentWithSubpartitions = {
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
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/src/' +
        'txt/data-lineage-test/schm-v0/data-v0/test-key=Bird/test1-key=TWO/employee-key=THREE/data-key=Four/firm-key=five'
      }
    }]
  };

  public bdataChildWithSubpartitionsToHaveChildren = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithSubpartitions.partitionKey,
    'partitionValue': 'ALPHA',
    'status': 'VALID',
    'subPartitionValues': ['beta', 'gamma', 'delta', 'epsilon'],
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/src/txt/data-lineage-test/' +
        'schm-v0/data-v0/test-key=ALPHA/test1-key=beta/employee-key=gamma/data-key=delta/firm-key=epsilon'
      }
    }],
    'businessObjectDataParents': [{
      'namespace': this.namespace,
      'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
      'businessObjectFormatUsage': this.bdataParentWithoutSubpartitions.businessObjectFormatUsage,
      'businessObjectFormatFileType': this.bdataParentWithoutSubpartitions.businessObjectFormatFileType,
      'businessObjectFormatVersion': 0,
      'partitionValue': this.bdataParentWithoutSubpartitions.partitionValue,
      'businessObjectDataVersion': 0
    },
      {
        'namespace': this.namespace,
        'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
        'businessObjectFormatUsage': this.bdataParentWithSubpartitions.businessObjectFormatUsage,
        'businessObjectFormatFileType': this.bdataParentWithSubpartitions.businessObjectFormatFileType,
        'businessObjectFormatVersion': 0,
        'partitionValue': this.bdataParentWithSubpartitions.partitionValue,
        'subPartitionValues': this.bdataParentWithSubpartitions.subPartitionValues,
        'businessObjectDataVersion': 0
      }]
  };

  public bdataChildWithoutSubpartitionsToHaveChildren = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'something',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=something'
      }
    }],
    'businessObjectDataParents': [{
      'namespace': this.namespace,
      'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
      'businessObjectFormatUsage': this.bdataParentWithoutSubpartitions.businessObjectFormatUsage,
      'businessObjectFormatFileType': this.bdataParentWithoutSubpartitions.businessObjectFormatFileType,
      'businessObjectFormatVersion': 0,
      'partitionValue': this.bdataParentWithoutSubpartitions.partitionValue,
      'businessObjectDataVersion': 0
    },
      {
        'namespace': this.namespace,
        'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
        'businessObjectFormatUsage': this.bdataParentWithSubpartitions.businessObjectFormatUsage,
        'businessObjectFormatFileType': this.bdataParentWithSubpartitions.businessObjectFormatFileType,
        'businessObjectFormatVersion': 0,
        'partitionValue': this.bdataParentWithSubpartitions.partitionValue,
        'subPartitionValues': this.bdataParentWithSubpartitions.subPartitionValues,
        'businessObjectDataVersion': 0
      }]
  };

  public bdataLeafWithoutSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'small data',
    'subPartitionValues': ['Juliet', 'Mercutio', 'Tybalt', 'Benvolio'],
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=small data'
      }
    }],
    'businessObjectDataParents': [{
      'namespace': this.namespace,
      'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
      'businessObjectFormatUsage': this.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatUsage,
      'businessObjectFormatFileType': this.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatFileType,
      'businessObjectFormatVersion': 0,
      'partitionValue': this.bdataChildWithoutSubpartitionsToHaveChildren.partitionValue,
      'businessObjectDataVersion': 0
    },
      {
        'namespace': this.namespace,
        'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
        'businessObjectFormatUsage': this.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatUsage,
        'businessObjectFormatFileType': this.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatFileType,
        'businessObjectFormatVersion': 0,
        'partitionValue': this.bdataChildWithSubpartitionsToHaveChildren.partitionValue,
        'subPartitionValues': this.bdataChildWithSubpartitionsToHaveChildren.subPartitionValues,
        'businessObjectDataVersion': 0
      }]
  };

  public bdataLeafWithSubpartitions = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithSubpartitions.partitionKey,
    'partitionValue': 'Romeo',
    'status': 'VALID',
    'subPartitionValues': ['Juliet', 'Mercutio', 'Tybalt', 'Benvolio'],
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/src/txt/data-lineage-test/' +
        'schm-v0/data-v0/test-key=Romeo/test1-key=Juliet/employee-key=Mercutio/data-key=Tybalt/firm-key=Benvolio'
      }
    }],
    'businessObjectDataParents': [{
      'namespace': this.namespace,
      'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
      'businessObjectFormatUsage': this.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatUsage,
      'businessObjectFormatFileType': this.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatFileType,
      'businessObjectFormatVersion': 0,
      'partitionValue': this.bdataChildWithoutSubpartitionsToHaveChildren.partitionValue,
      'businessObjectDataVersion': 0
    },
      {
        'namespace': this.namespace,
        'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
        'businessObjectFormatUsage': this.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatUsage,
        'businessObjectFormatFileType': this.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatFileType,
        'businessObjectFormatVersion': 0,
        'partitionValue': this.bdataChildWithSubpartitionsToHaveChildren.partitionValue,
        'subPartitionValues': this.bdataChildWithSubpartitionsToHaveChildren.subPartitionValues,
        'businessObjectDataVersion': 0
      }]
  };

  public noLineageBdata = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'Spider',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=Spider'
      }
    }]
  };

  public statusChange = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'CrazyEights',
    'status': 'UPLOADING',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=CrazyEights'
      }
    }]
  }
}
