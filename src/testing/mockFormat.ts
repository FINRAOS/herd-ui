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
export class MockFormat {

  private _formatDetail = {
    'id': 123456,
    'namespace': 'TEST-NAMESPACE',
    'businessObjectDefinitionName': 'ADMIN',
    'businessObjectFormatUsage': 'TSTSRC',
    'businessObjectFormatFileType': 'TSTBZ',
    'businessObjectFormatVersion': 0,
    'latestVersion': true,
    'partitionKey': 'PARTITION-KEY',
    'description': 'format description',
    'documentSchema': 'test document schema',
    'attributes': [],
    'attributeDefinitions': [],
    'recordFlag': 'true',
    'retentionPeriodInDays': '15',
    'retentionType': 'testtype',
    'schema': {
      'columns': [
        {
          'name': 'TESTNAME1',
          'type': 'BINARY',
          'size': null,
          'required': null,
          'defaultValue': null,
          'description': null,
        }, {
          'name': 'TESTNAME',
          'type': 'BINARY',
          'size': null,
          'required': null,
          'defaultValue': null,
          'description': null,
        }, {
          'name': 'TESTNAME2',
          'type': 'FLOAT',
          'size': null,
          'required': null,
          'defaultValue': null,
          'description': null,
          'schemaColumnName': 'TESTNAME'
        }
      ],
      'partitions': [
        {
          'name': 'PRCSG_DT',
          'type': 'DATE',
          'size': null,
          'required': null,
          'defaultValue': null,
          'description': null,
          'schemaColumnName': 'TESTNAME'
        }
      ],
      'nullValue': '',
      'delimiter': '\\001',
      'escapeCharacter': '\\005',
      'partitionKeyGroup': 'TRADE_DT'
    },
    'businessObjectFormatParents': [],
    'businessObjectFormatChildren': []
  };
  private _businessObjectDefinitionColumnKeys = [
    {
      'namespace': 'testns',
      'businessObjectDefinitionName': 'ADMIN',
      'businessObjectFormatUsage': 'TXT',
      'businessObjectFormatFileType': 'TST',
      'businessObjectFormatVersion': 0,
    }, {
      'namespace': 'testns1',
      'businessObjectDefinitionName': 'TESTADMIN',
      'businessObjectFormatUsage': 'SRC',
      'businessObjectFormatFileType': 'TXT',
      'businessObjectFormatVersion': 0,
    }, {
      'namespace': 'testns2',
      'businessObjectDefinitionName': 'TEST1ADMIN',
      'businessObjectDefinitionColumnName': 'Test Code',
    }, {
      'namespace': 'testns3',
      'businessObjectDefinitionName': 'ADMIN',
      'businessObjectDefinitionColumnName': 'Test Agent Identifier',
    }];

  get formatDetail() {
    return this._formatDetail;
  }

  get businessObjectDefinitionColumnKeys() {
    return this._businessObjectDefinitionColumnKeys;
  }
}
