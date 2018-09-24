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
 * Generates requests for posting to Server
 * Utilizes the data specified in jsonSchema.js and this.data.js
 */

import { DataManager } from './../../../../util/DataManager';
import { Data } from './data';
import * as schema from './../../../../util/JsonSchema';

export class Operations {

  private dataManager = new DataManager();
  private data = new Data();


  /**
   * Generate the post requests for required data:
   * namespace / data provider / bdef / bdata
   * @returns {{options: *[]}}
   */

  public postRequests() {
    return {
      'options': [
        this.dataManager.DMOption(1, new schema.Namespace().postUrl(), new schema.Namespace().postBody(this.data.defaultNamespace)),
        this.dataManager
          .DMOption(2, new schema.DataProvider().postUrl(), new schema.DataProvider().postBody(this.data.defaultDataProvider)),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitions().postUrl(), this.data.bdef),
        this.dataManager.DMOption(4, new schema.BusinessObjectFormats().postUrl(), this.data.formatWithSubpartitions),
        this.dataManager.DMOption(4, new schema.BusinessObjectFormats().postUrl(), this.data.formatWithNoSubpartitions),
        this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataWithoutSubpartitions),
        this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataWithSubpartitions),
        this.dataManager.DMOption(6, new schema.BusinessObjectDefinitionData().postUrl(), this.data.versionTestV0),
        this.dataManager.DMOption(7, new schema.BusinessObjectDefinitionData().postUrl(), this.data.versionTestV1),
        this.dataManager.DMOption(8, new schema.BusinessObjectDefinitionData().postUrl(), this.data.versionTestV2),
      ]
    }
  }

  public deleteRequests() {
    return {
      options: [
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.versionTestV2.businessObjectFormatUsage,
          this.data.versionTestV2.businessObjectFormatFileType,
          this.data.versionTestV2.businessObjectFormatVersion,
          this.data.versionTestV2.partitionValue, 2, true
        )),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.versionTestV1.businessObjectFormatUsage,
          this.data.versionTestV1.businessObjectFormatFileType,
          this.data.versionTestV1.businessObjectFormatVersion,
          this.data.versionTestV1.partitionValue, 1, true
        )),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.versionTestV1.businessObjectFormatUsage,
          this.data.versionTestV1.businessObjectFormatFileType,
          this.data.versionTestV1.businessObjectFormatVersion,
          this.data.versionTestV1.partitionValue, 0, true
        )),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataWithoutSubpartitions.businessObjectFormatUsage,
          this.data.bdataWithoutSubpartitions.businessObjectFormatFileType,
          this.data.bdataWithoutSubpartitions.businessObjectFormatVersion,
          this.data.bdataWithoutSubpartitions.partitionValue, 0, true
        )),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWith4SubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataWithSubpartitions.businessObjectFormatUsage,
          this.data.bdataWithSubpartitions.businessObjectFormatFileType,
          this.data.bdataWithSubpartitions.businessObjectFormatVersion,
          this.data.bdataWithSubpartitions.partitionValue,
          this.data.bdataWithSubpartitions.subPartitionValues[0],
          this.data.bdataWithSubpartitions.subPartitionValues[1],
          this.data.bdataWithSubpartitions.subPartitionValues[2],
          this.data.bdataWithSubpartitions.subPartitionValues[3], 0, true
        )),
        this.dataManager.DMOption(4, new schema.BusinessObjectFormats().deleteUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.formatWithNoSubpartitions.businessObjectFormatUsage,
          this.data.formatWithNoSubpartitions.businessObjectFormatFileType,
          0
        )),
        this.dataManager.DMOption(4, new schema.BusinessObjectFormats().deleteUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.formatWithSubpartitions.businessObjectFormatUsage,
          this.data.formatWithSubpartitions.businessObjectFormatFileType,
          0
        )),
        this.dataManager.DMOption(5, new schema.BusinessObjectDefinitions().deleteUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName
        )),
        this.dataManager.DMOption(6, new schema.DataProvider().deleteUrl(this.data.defaultDataProvider)),
        this.dataManager.DMOption(7, new schema.Namespace().deleteUrl(this.data.defaultNamespace))]
    }
  }
}

const operation = new Operations();
export const initRequests = {
  posts: {
    options: operation.postRequests().options
  }
};

export const tearDownRequests = {
  deletes:  {
    options: operation.deleteRequests().options
  }
};
