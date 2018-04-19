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

import {
  Attribute,
  BusinessObjectDataCreateRequest,
  BusinessObjectDefinition,
  BusinessObjectFormatCreateRequest
} from '@herd/angular-client';
import utils from '../../../../util/utils';

const conf = require('./../../../../config/conf.e2e.json');
const defaultNamespace = utils.dataPrefix + 'NS_PROTRACTOR_TEST_DL';
const defaultDataProvider = 'DP_PROTRACTOR_TEST_DL';

const bdef1: BusinessObjectDefinition = {
    'namespace': defaultNamespace,
    'dataProviderName': defaultDataProvider,
    'businessObjectDefinitionName': 'Data_Object_List_Test',
    'description': 'DATA FOR TESTING DATA LIST',
    'displayName': 'DATA FOR TESTING DATA LIST'
};

const formatWithData: BusinessObjectFormatCreateRequest = {
    namespace: bdef1.namespace,
    businessObjectDefinitionName: bdef1.businessObjectDefinitionName,
    businessObjectFormatUsage: 'PRC',
    businessObjectFormatFileType: 'BZ',
    partitionKey: 'TEST_KEY',
    description: 'Nam et interdum quam, hendrerit varius magna.',
    schema: {
        nullValue: 'NULL',
        delimiter: '|',
        escapeCharacter: '\\',
        columns: [{
            name: 'TEST_ID', type: 'VARCHAR', size: '30'
        }],
        partitions: [{
            'name': 'TEST_KEY', 'type': 'VARCHAR', 'size': null, 'required': null, 'defaultValue': null, 'description': null
        }, {
            'name': 'TEST2_KEY', 'type': 'VARCHAR', 'size': null, 'required': null, 'defaultValue': null, 'description': null
        }, {
            'name': 'TEST3_KEY', 'type': 'VARCHAR', 'size': null, 'required': null, 'defaultValue': null, 'description': null
        }, {
            'name': 'TEST4_KEY', 'type': 'VARCHAR', 'size': null, 'required': null, 'defaultValue': null, 'description': null
        }, {
            'name': 'TEST5_KEY', 'type': 'VARCHAR', 'size': null, 'required': null, 'defaultValue': null, 'description': null
        }]
    }
};


const formatNoData: BusinessObjectFormatCreateRequest = {
    namespace: bdef1.namespace,
    businessObjectDefinitionName: bdef1.businessObjectDefinitionName,
    businessObjectFormatUsage: 'SRC',
    businessObjectFormatFileType: 'BZ',
    partitionKey: 'TEST_KEY'
};

const formatForFilter: BusinessObjectFormatCreateRequest = {
    namespace: bdef1.namespace,
    businessObjectDefinitionName: bdef1.businessObjectDefinitionName,
    businessObjectFormatUsage: 'TEST_1',
    businessObjectFormatFileType: 'TXT',
    partitionKey: 'TEST_KEY',
    schema: {
        'nullValue': 'NULL',
        'delimiter': '|',
        'escapeCharacter': '\\',
        'columns': [{
            'name': 'TEST_KEY', 'type': 'VARCHAR'
        }], 'partitions': [{
            'name': 'TEST_KEY', 'type': 'VARCHAR'
        }, {
            'name': 'TEST3_KEY', 'type': 'VARCHAR'
        }, {
            'name': 'TEST4_KEY', 'type': 'VARCHAR'
        }, {
            'name': 'TEST5_KEY', 'type': 'VARCHAR'
        }, {
            'name': 'TEST6_KEY', 'type': 'VARCHAR'
        }]
    }
};
const attr1: Attribute = {
    'name': 'ATTRIBUTE_NAME_ONE',
    'value': 'ATTRIBUTE_VALUE_ONE'
};
const attr2: Attribute = {
    'name': 'ATTRIBUTE_NAME_TWO',
    'value': 'ATTRIBUTE_VALUE_TWO'
};
const attr3: Attribute = {
    'name': 'ATTRIBUTE_NAME_THREE',
    'value': 'ATTRIBUTE_VALUE_THREE'
};

const bdataWithSubPartitions: BusinessObjectDataCreateRequest = {
    namespace: formatForFilter.namespace,
    businessObjectDefinitionName: formatForFilter.businessObjectDefinitionName,
    businessObjectFormatUsage: formatForFilter.businessObjectFormatUsage,
    businessObjectFormatFileType: formatForFilter.businessObjectFormatFileType,
    businessObjectFormatVersion: 0,
    partitionKey: formatForFilter.partitionKey,
    partitionValue: 'WithSubPartitions',
    status: 'VALID',
    subPartitionValues: ['BIRD', 'CAT', 'ELEPHANT', 'HIPPOPOTAMUS'],
    'storageUnits': [{
        'storageName': 'S3_MANAGED', 'storageDirectory': {
            // used this due to such a long string. should not be used otherwise
            // tslint:disable-next-line:max-line-length
            'directoryPath': utils.dataPrefix +
            'ns-protractor-test-dl/dp-protractor-test-dl/test-1/txt/data-object-list-test/schm-v0/data-v0/test-key=WithSubPartitions/' + conf.mmodule + '=BIRD/employee-key=CAT/data-key=ELEPHANT/firm-key=HIPPOPOTAMUS'
        }
    }]
};

const bdata1: BusinessObjectDataCreateRequest = {
    'namespace': formatForFilter.namespace,
    'businessObjectDefinitionName': formatForFilter.businessObjectDefinitionName,
    'businessObjectFormatUsage': formatForFilter.businessObjectFormatUsage,
    'businessObjectFormatFileType': formatForFilter.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': formatForFilter.partitionKey,
    'partitionValue': 'TEST_1',
    'status': 'VALID',
    'attributes': [attr1, attr2],
    'storageUnits': [{
        'storageName': 'S3_MANAGED',
        'storageDirectory': {
            'directoryPath': utils.dataPrefix +
            'ns-protractor-test-dl/dp-protractor-test-dl/test-1/txt/data-object-list-test/schm-v0/data-v0/test-key=TEST_1'
        }
    }]
};

const bdata2: BusinessObjectDataCreateRequest = {
    'namespace': formatForFilter.namespace,
    'businessObjectDefinitionName': formatForFilter.businessObjectDefinitionName,
    'businessObjectFormatUsage': formatForFilter.businessObjectFormatUsage,
    'businessObjectFormatFileType': formatForFilter.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': formatForFilter.partitionKey,
    'partitionValue': 'TEST_2',
    'status': 'VALID',
    'attributes': [attr1],
    'storageUnits': [{
        'storageName': 'S3_MANAGED', 'storageDirectory': {
            'directoryPath': utils.dataPrefix +
            'ns-protractor-test-dl/dp-protractor-test-dl/test-1/txt/data-object-list-test/schm-v0/data-v0/test-key=TEST_2'
        }
    }]
};

const bdata3: BusinessObjectDataCreateRequest = {
    'namespace': formatForFilter.namespace,
    'businessObjectDefinitionName': formatForFilter.businessObjectDefinitionName,
    'businessObjectFormatUsage': formatForFilter.businessObjectFormatUsage,
    'businessObjectFormatFileType': formatForFilter.businessObjectFormatFileType,
    'businessObjectFormatVersion': 0,
    'partitionKey': formatForFilter.partitionKey,
    'partitionValue': 'TEST_3',
    'status': 'VALID',
    'attributes': [attr2, attr3],
    'storageUnits': [{
        'storageName': 'S3_MANAGED', 'storageDirectory': {
            'directoryPath': utils.dataPrefix +
            'ns-protractor-test-dl/dp-protractor-test-dl/test-1/txt/data-object-list-test/schm-v0/data-v0/test-key=TEST_3'
        }
    }]
};

export default {
    description: 'Sample description text for testing purpose.',
    defaultDataProvider,
    defaultNamespace,
    bdef1,
    formatNoData,
    formatForFilter,
    formatWithData,
    bdata1,
    bdata2,
    bdata3,
    bdataWithSubPartitions
}
