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
 * Generates requests for posting to HERD
 * Utilizes the data specified in jsonSchema.js and this.data.js
 */

import {DataManager} from './../../../../../util/DataManager';
import {Data} from './data';
import * as schema from './../../../../../util/JsonSchema';


export class Operations {

  public dataManager = new DataManager();
  public data = new Data();

  /**
   * Generate the post requests for required data:
   * namespace / data provider / bdef / data-objects
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
        this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataParentWithoutSubpartitions),
        this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataParentWithSubpartitions),
        this.dataManager
          .DMOption(6, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataChildWithSubpartitionsToHaveChildren),
        this.dataManager
          .DMOption(6, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataChildWithoutSubpartitionsToHaveChildren),
        this.dataManager.DMOption(7, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataLeafWithoutSubpartitions),
        this.dataManager.DMOption(7, new schema.BusinessObjectDefinitionData().postUrl(), this.data.bdataLeafWithSubpartitions),
        this.dataManager.DMOption(7, new schema.BusinessObjectDefinitionData().postUrl(), this.data.noLineageBdata),
        this.dataManager.DMOption(7, new schema.BusinessObjectDefinitionData().postUrl(), this.data.statusChange)
      ]
    }
  }

  public deleteRequests() {
    return {
      options: [
        this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.statusChange.businessObjectFormatUsage,
          this.data.statusChange.businessObjectFormatFileType,
          this.data.statusChange.businessObjectFormatVersion,
          this.data.statusChange.partitionValue, 0, true
        )),
        this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.noLineageBdata.businessObjectFormatUsage,
          this.data.noLineageBdata.businessObjectFormatFileType,
          this.data.noLineageBdata.businessObjectFormatVersion,
          this.data.noLineageBdata.partitionValue, 0, true
        )),
        this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataLeafWithoutSubpartitions.businessObjectFormatUsage,
          this.data.bdataLeafWithoutSubpartitions.businessObjectFormatFileType,
          this.data.bdataLeafWithoutSubpartitions.businessObjectFormatVersion,
          this.data.bdataLeafWithoutSubpartitions.partitionValue, 0, true
        )),
        this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWith4SubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataLeafWithSubpartitions.businessObjectFormatUsage,
          this.data.bdataLeafWithSubpartitions.businessObjectFormatFileType,
          this.data.bdataLeafWithSubpartitions.businessObjectFormatVersion,
          this.data.bdataLeafWithSubpartitions.partitionValue,
          this.data.bdataLeafWithSubpartitions.subPartitionValues[0],
          this.data.bdataLeafWithSubpartitions.subPartitionValues[1],
          this.data.bdataLeafWithSubpartitions.subPartitionValues[2],
          this.data.bdataLeafWithSubpartitions.subPartitionValues[3], 0, true
        )),
        this.dataManager.DMOption(2, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatUsage,
          this.data.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatFileType,
          this.data.bdataChildWithoutSubpartitionsToHaveChildren.businessObjectFormatVersion,
          this.data.bdataChildWithoutSubpartitionsToHaveChildren.partitionValue, 0, true
        )),
        this.dataManager.DMOption(2, new schema.BusinessObjectDefinitionData().deleteWith4SubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatUsage,
          this.data.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatFileType,
          this.data.bdataChildWithSubpartitionsToHaveChildren.businessObjectFormatVersion,
          this.data.bdataChildWithSubpartitionsToHaveChildren.partitionValue,
          this.data.bdataChildWithSubpartitionsToHaveChildren.subPartitionValues[0],
          this.data.bdataChildWithSubpartitionsToHaveChildren.subPartitionValues[1],
          this.data.bdataChildWithSubpartitionsToHaveChildren.subPartitionValues[2],
          this.data.bdataChildWithSubpartitionsToHaveChildren.subPartitionValues[3], 0, true
        )),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataParentWithoutSubpartitions.businessObjectFormatUsage,
          this.data.bdataParentWithoutSubpartitions.businessObjectFormatFileType,
          this.data.bdataParentWithoutSubpartitions.businessObjectFormatVersion,
          this.data.bdataParentWithoutSubpartitions.partitionValue, 0, true
        )),
        this.dataManager.DMOption(3, new schema.BusinessObjectDefinitionData().deleteWith4SubPartitionsUrl(
          this.data.defaultNamespace,
          this.data.bdef.businessObjectDefinitionName,
          this.data.bdataParentWithSubpartitions.businessObjectFormatUsage,
          this.data.bdataParentWithSubpartitions.businessObjectFormatFileType,
          this.data.bdataParentWithSubpartitions.businessObjectFormatVersion,
          this.data.bdataParentWithSubpartitions.partitionValue,
          this.data.bdataParentWithSubpartitions.subPartitionValues[0],
          this.data.bdataParentWithSubpartitions.subPartitionValues[1],
          this.data.bdataParentWithSubpartitions.subPartitionValues[2],
          this.data.bdataParentWithSubpartitions.subPartitionValues[3], 0, true
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
        this.dataManager.DMOption(7, new schema.Namespace().deleteUrl(this.data.defaultNamespace))
      ]
    }
  }

  public updateRequests() {
    return {
      'options': [
        this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().putStatusUrl(this.data.statusChange.namespace,
          this.data.statusChange.businessObjectDefinitionName,
          this.data.statusChange.businessObjectFormatUsage,
          this.data.statusChange.businessObjectFormatFileType,
          this.data.statusChange.businessObjectFormatVersion,
          this.data.statusChange.partitionValue,
          0), {status: 'VALID'})
      ]
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
  updates: operation.updateRequests(),
  deletes:  {
    options: operation.deleteRequests().options
  }
};
