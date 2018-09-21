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
 * bdefShortDescription: exports.data.bdefShortDescription, bdefNoDescription: exports.data.bdefNoDescription,
 * bdefNoDisplayName: exports.data.bdefNoDisplayName}}
 */
import utils from '../../../../util/utils'

export class Data {
    description = 'Sample description text for testing purpose. Used for all description fields';
    defaultDataProvider = 'DP_PROTRACTOR_TEST_COL';
    defaultNamespace = 'NS_PROTRACTOR_TEST_COL';
    bdefTestNoDFName = 'BDEF_TEST_NO_DF';
    bdefTestDFName = 'BDEF_TEST_DF_SCHEMA';
    bdefTestDFNoSchemaName = 'BDEF_TEST_DF_NO_SCHEMA';
    bdefTestDFSchemaWithPartitions = 'BDEF_TEST_DF_SCHEMA_PARTITIONS';
    // different bdef name per browser so each browser can edit without affecting another
    bdefTestEditColumns = utils.dataPrefix + '_BDEF_TEST_DF_EDIT_COLUMNS';
    private displayName = 'display name of ';
    bdefColumnName1 = 'column 100';
    bdefColumnName2 = 'column 101';

    bdefTestNoDF() {
        return {
            'namespace': this.defaultNamespace,
            'dataProviderName': this.defaultDataProvider,
            'businessObjectDefinitionName': this.bdefTestNoDFName,
            'description': this.description,
            'displayName': this.displayName + this.bdefTestNoDFName
        };
    }

    bdefTestDF() {
        return {
            'namespace': this.defaultNamespace,
            'dataProviderName': this.defaultDataProvider,
            'businessObjectDefinitionName': this.bdefTestDFName,
            'description': this.description,
            'displayName': this.displayName + this.bdefTestDFName
        }
    }

    bdefTestDFNoSchema() {
        return {
            'namespace': this.defaultNamespace,
            'dataProviderName': this.defaultDataProvider,
            'businessObjectDefinitionName': this.bdefTestDFNoSchemaName,
            'description': this.description,
            'displayName': this.displayName + this.bdefTestDFNoSchemaName
        }
    }

    bdefTestDFSchemaWith_Partitions() {
        return {
            'namespace': this.defaultNamespace,
            'dataProviderName': this.defaultDataProvider,
            'businessObjectDefinitionName': this.bdefTestDFSchemaWithPartitions,
            'description': this.description,
            'displayName': this.displayName + this.bdefTestDFSchemaWithPartitions
        }
    }

    get editColumnBdef() {
        return {
            'namespace': this.defaultNamespace,
            'dataProviderName': this.defaultDataProvider,
            'businessObjectDefinitionName': this.bdefTestEditColumns,
            'description': this.description,
            'displayName': this.displayName + this.bdefTestEditColumns
        }
    }

    // put DF, contains schema columns => put respective bdef columns
    bdefTestDF_FORMAT() {
        const befTestFormat = {
            'namespace': this.defaultNamespace,
            'businessObjectDefinitionName': this.bdefTestDFName,
            'businessObjectFormatUsage': 'USG1',
            'businessObjectFormatFileType': 'TXT',
            'partitionKey': 'TEST_KEY',
            'description': 'Nam et interdum quam, hendrerit varius magna.',
            'schema': {
                'nullValue': 'NULL', 'delimiter': '|', 'escapeCharacter': '\\',
                'columns': [
                    {
                        'name': 'CLM_100', // bdef column name:'column 100'
                        'type': 'varchar',
                        'size': '2000',
                        'required': true,
                        'defaultValue': 'clm_100',
                        'description': 'this is for testing'
                    },
                    {
                        'name': 'CLM_101', // bdef column name:'column 101'
                        'type': 'Integer',
                        'size': '10',
                        'required': true,
                        'defaultValue': 'clm_100',
                        'description': 'this is for testing'
                    }
                ]
            }
        };
        return befTestFormat;
    }

    // put DF, contains schema columns with partitions
    bdefTestDF_FORMAT_WithPartitions() {
        const bdefTestFormatWithPartitions = {
            'namespace': this.defaultNamespace,
            'businessObjectDefinitionName': this.bdefTestDFSchemaWithPartitions,
            'businessObjectFormatUsage': 'USG2',
            'businessObjectFormatFileType': 'TXT',
            'partitionKey': 'TEST_KEY',
            'description': 'Nam et interdum quam, hendrerit varius magna.',
            'schema': {
                'nullValue': 'NULL', 'delimiter': '|', 'escapeCharacter': '\\',
                'columns': [
                    {
                        'name': 'TEST_KEY',
                        'type': 'varchar',
                        'size': '2000',
                        'required': true,
                        'defaultValue': 'clm_1',
                        'description': 'this is for testing'
                    },
                    {
                        'name': 'CLM_11',
                        'type': 'varchar',
                        'size': '10',
                        'required': true,
                        'defaultValue': 'clm_2',
                        'description': 'this is for testing'
                    }
                ],
                'partitions': [
                    {
                        'name': 'TEST_KEY',
                        'type': 'varchar',
                        'size': '2000',
                        'required': true,
                        'defaultValue': 'clm_1',
                        'description': 'this is for testing'
                    },
                    {
                        'name': 'CLM_11',
                        'type': 'varchar',
                        'size': '10',
                        'required': true,
                        'defaultValue': 'clm_2',
                        'description': 'this is for testing'
                    }
                ]
            }
        };
        return bdefTestFormatWithPartitions;
    }

    get editableColumnsFormat() {
        const bdefTestFormatWithPartitions = {
            'namespace': this.defaultNamespace,
            'businessObjectDefinitionName': this.bdefTestEditColumns,
            'businessObjectFormatUsage': 'USG3',
            'businessObjectFormatFileType': 'TXT',
            'partitionKey': 'TEST_KEY',
            'description': 'Nam et interdum quam, hendrerit varius magna.',
            'schema': {
                'nullValue': 'NULL', 'delimiter': '|', 'escapeCharacter': '\\',
                'columns': [
                    {
                        'name': 'TEST_KEY',
                        'type': 'varchar',
                        'size': '2000',
                        'required': true,
                        'defaultValue': 'clm_1',
                        'description': 'this is for testing'
                    },
                    {
                        'name': 'CLM_11',
                        'type': 'varchar',
                        'size': '10',
                        'required': true,
                        'defaultValue': 'clm_2',
                        'description': 'this is for testing'
                    }
                ],
            }
        };
        return bdefTestFormatWithPartitions;
    }

    // put DF, no schema columns or bdef columns
    bdefTestDFNoSchema_FORMAT() {
        const befTestFormat = {
            'namespace': this.defaultNamespace,
            'businessObjectDefinitionName': this.bdefTestDFNoSchemaName,
            'businessObjectFormatUsage': 'USG3',
            'businessObjectFormatFileType': 'TXT',
            'partitionKey': 'TEST_KEY',
            'description': 'Nam et interdum quam, hendrerit varius magna.'
        };
        return befTestFormat;
    }
}
