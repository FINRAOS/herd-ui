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
import utils from "../../../../util/utils";

const uniqueId = utils.uniqueId();
export class Data {
  description = 'Sample description text for testing purpose. Used for all description fields';
  defaultDataProvider = 'DP_PROTRACTOR_TEST_SCHM' + uniqueId;
  defaultNamespace = 'NS_PROTRACTOR_TEST_SCHM' + uniqueId;
  bdefWithDocumentSchema = 'BDEF_TEST_WITH_DOC_SCHM';
  bdefNoDocumentSchema = 'BDEF_TEST_NO_DOC_SCHM';
  bdefWithDocumentSchemaUrl = 'BDEF_TEST_WITH_DOC_SCHM_URL';
  documentSchema = 'Sample document schema';
  documentSchemaUrl = 'Sample document schema url';
  displayName = 'display name of ';

 bdefTestWithDocumentSchemaUrl() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': this.bdefWithDocumentSchemaUrl,
      'description': this.description,
      'displayName': this.displayName + this.bdefWithDocumentSchemaUrl
    };
  }

  bdefTestWithDocumentSchema() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': this.bdefWithDocumentSchema,
      'description': this.description,
      'displayName': this.displayName + this.bdefWithDocumentSchema
    };
  }

  bdefTestNoDocumentSchema() {
    return {
      'namespace': this.defaultNamespace,
      'dataProviderName': this.defaultDataProvider,
      'businessObjectDefinitionName': this.bdefNoDocumentSchema,
      'description': this.description,
      'displayName': this.displayName + this.bdefNoDocumentSchema
    };
  }

  // put DF, contains document schemabformat2
  bdefTestWithDocumentSchema_FORMAT() {
    const befTestDocumentSchemaFormat = {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': this.bdefWithDocumentSchema,
      'businessObjectFormatUsage': 'USG1',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': 'Nam et interdum quam, hendrerit varius magna.',
      'documentSchema': this.documentSchema,
      'documentSchemaUrl': this.documentSchemaUrl,
    };
    return befTestDocumentSchemaFormat;
  }

  // put DF, contains document schema
    bdefTestWithDocumentSchemaUrl_FORMAT() {
      const befTestDocumentSchemaFormat = {
        'namespace': this.defaultNamespace,
        'businessObjectDefinitionName': this.bdefWithDocumentSchemaUrl,
        'businessObjectFormatUsage': 'USG1',
        'businessObjectFormatFileType': 'TXT',
        'partitionKey': 'TEST_KEY',
        'description': 'Nam et interdum quam, hendrerit varius magna.',
        'documentSchema': this.documentSchema,
        'documentSchemaUrl': this.documentSchemaUrl,
      };
      return befTestDocumentSchemaFormat;
    }

  // put DF, no schema columns or bdef columns
  bdefTestDFNoSchema_FORMAT() {
    const befTestFormat = {
      'namespace': this.defaultNamespace,
      'businessObjectDefinitionName': this.bdefNoDocumentSchema,
      'businessObjectFormatUsage': 'USG2',
      'businessObjectFormatFileType': 'TXT',
      'partitionKey': 'TEST_KEY',
      'description': 'Nam et interdum quam, hendrerit varius magna.'
    };
    return befTestFormat;
  }
}
