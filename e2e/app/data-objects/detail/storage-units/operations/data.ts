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
 * @types {{}}
 */
import utils from '../../../../../util/utils';

const uniqueId = utils.uniqueId();

export class Data {
  public description = 'Sample description text for testing purpose. Used for data-objects detail screen';
  public defaultDataProvider = 'DP_PROTRACTOR_TEST_DL42' + uniqueId;
  public dataProviderName = this.defaultDataProvider;
  public namespace = 'NS_PROTRACTOR_TEST_DL42' + uniqueId;
  public defaultNamespace = this.namespace;
  public bdef = {
    'namespace': this.namespace,
    'dataProviderName': this.defaultDataProvider,
    'businessObjectDefinitionName': 'DATA_LINEAGE_TEST',
    'description': 'Description of the bdef',
    'displayName': 'DATA FOR TESTING BDATA DETAIL'
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
          'name': 'TEST_ID',
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

// storage units spec data
  public noStorageFiles = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'TEST_60',
    'status': 'UPLOADING',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=TEST_60'
      }
    }]
  };


  public versionTestV2 = {
    'namespace': 'PERFDATASEARCH',
    'businessObjectDefinitionName': 'PERFDATA',
    'businessObjectFormatUsage': 'DDLDATA',
    'businessObjectFormatFileType': 'TXT',
    'businessObjectFormatVersion': 0,
    'partitionKey': 'PERFKEY',
    'partitionValue': 'PERKEY10002',
    'status': 'VALID',
    'storageUnits': [
      {
        'storageName': 'DDLStorage9638',
        'storageDirectory': {
          'directoryPath': 'Directory:\nperfdatasearch/perfprovider/ddldata/txt/perfdata/' +
            'schm-v0/data-v0/perfkey=PERFKEY999/perfkey1=test1/perfkey2=thing2/perfkey3=other3/perfkey4=b4'
        },
        'storageFiles': [
          {
            'filePath': 'perfdatasearch/perfprovider/ddldata/txt/perfdata/schm-v0/data-v0/perfkey=PERFKEY999/' +
              'perfkey1=test1/perfkey2=thing2/perfkey3=other3/perfkey4=b4/testA000.txt',
            'fileSizeBytes': 10,
            'rowCount': 1
          },
          {
            'filePath': 'perfdatasearch/perfprovider/ddldata/txt/perfdata/schm-v0/data-v0/perfkey=PERFKEY999/' +
              'perfkey1=test1/perfkey2=thing2/perfkey3=other3/perfkey4=b4/testA001.txt',
            'fileSizeBytes': 10,
            'rowCount': 1
          }
        ]
      },
      {
        'storageName': 'sampleStorage',
        'storageDirectory': {
          'directoryPath': 'Directory:\nperfdatasearch/perfprovider/ddldata/txt/perfdata/' +
            'schm-v0/data-v0/perfkey=PERFKEY999/perfkey1=test1/perfkey2=thing2/perfkey3=other3/perfkey4=b4'
        },
        'storageFiles': [
          {
            'filePath': 'perfdatasearch/perfprovider/ddldata/txt/perfdata/schm-v0/data-v0/perfkey=PERFKEY999/' +
              'perfkey1=test1/perfkey2=thing2/perfkey3=other3/perfkey4=b4/testA000.txt',
            'fileSizeBytes': 10,
            'rowCount': 1
          },
          {
            'filePath': 'perfdatasearch/perfprovider/ddldata/txt/perfdata/schm-v0/data-v0/perfkey=PERFKEY999/' +
              'perfkey1=test1/perfkey2=thing2/perfkey3=other3/perfkey4=b4/testA001.txt',
            'fileSizeBytes': 10,
            'rowCount': 1
          }
        ]
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
  };


  public singleStorageFile = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'TEST_61',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0/test-key=TEST_61'
      },
      'storageFiles': [{
        'filePath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/data-v0' +
          '/test-key=TEST_61/test.txt',
        'fileSizeBytes': 35,
        'rowCount': 1
      }]
    }]

  };

  public multipleStorageFiles = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'TEST_62',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/' +
          'data-lineage-test/schm-v0/data-v0/test-key=TEST_62'
      },
      'storageFiles': [
        {
          'filePath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/' +
            'data-v0/test-key=TEST_62/test.txt',
          'fileSizeBytes': 35
        },
        {
          'filePath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/' +
            'schm-v0/data-v0/test-key=TEST_62/test1.txt',
          'fileSizeBytes': 35
        },
        {
          'filePath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc/data-lineage-test/schm-v0/' +
            'data-v0/test-key=TEST_62/test2.txt',
          'fileSizeBytes': 35
        }]
    }]

  };

  public multipleStorageUnits = {
    'namespace': this.namespace,
    'businessObjectDefinitionName': this.bdef.businessObjectDefinitionName,
    'businessObjectFormatUsage': this.formatWithNoSubpartitions.businessObjectFormatUsage,
    'businessObjectFormatFileType': this.formatWithNoSubpartitions.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': this.formatWithNoSubpartitions.partitionKey,
    'partitionValue': 'TEST_64',
    'status': 'VALID',
    'storageUnits': [{
      'storageName': 'oracletestdb',
      'storageDirectory': {
        'directoryPath': 'workspace/test'
      },
      'storageFiles': [{
        'filePath': 'workspace/test/test.txt',
        'fileSizeBytes': 69
      }]
    }, {
      'storageName': 'S3_MANAGED',
      'storageDirectory': {
        'directoryPath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc' +
          '/data-lineage-test/schm-v0/data-v0/test-key=TEST_64'
      },
      'storageFiles': [{
        'filePath': 'ns-protractor-test-dl42/dp-protractor-test-dl42/prc/orc' +
          '/data-lineage-test/schm-v0/data-v0/test-key=TEST_64/test.txt',
        'fileSizeBytes': 35
      }]
    }]
  };

}
