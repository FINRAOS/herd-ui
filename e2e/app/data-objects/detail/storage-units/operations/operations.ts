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
 * Generates requests for posting to Service
 * Utilizes the data specified in jsonSchema.js and this.data.js
 */

import { Data } from './data';
import * as schema from './../../../../../util/JsonSchema';
import { DataManager } from './../../../../../util/DataManager';
import { S3Manager } from '../../../../../util/S3Manager';

export class Operations {
  public dataManager: DataManager;
  public aws: S3Manager;
  public data: Data;

  constructor() {
    this.aws = new S3Manager();
    this.dataManager = new DataManager();
    this.data = new Data();
  }

  /**
   * Generate the post requests for required data:
   * namespace / data provider / bdef / data-objects
   * @return options: *[]
   */

  public postRequests () {
  return {
    'options': [
      this.dataManager.DMOption(1, new schema.Namespace().postUrl(), new schema.Namespace().postBody(this.data.defaultNamespace)),
      this.dataManager.DMOption(2, new schema.DataProvider().postUrl(), new schema.DataProvider().postBody(this.data.defaultDataProvider)),
      this.dataManager.DMOption(3, new schema.BusinessObjectDefinitions().postUrl(), this.data.bdef),
      this.dataManager.DMOption(4, new schema.BusinessObjectFormats().postUrl(), this.data.formatWithNoSubpartitions),
      this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.noStorageFiles),
      this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.singleStorageFile),
      this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.multipleStorageFiles),
      this.dataManager.DMOption(5, new schema.BusinessObjectDefinitionData().postUrl(), this.data.multipleStorageUnits),
    ]
  };
}

  public deleteRequests () {
  return {
    'options': [
      this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
        this.data.defaultNamespace,
        this.data.bdef.businessObjectDefinitionName,
        this.data.multipleStorageUnits.businessObjectFormatUsage,
        this.data.multipleStorageUnits.businessObjectFormatFileType,
        this.data.multipleStorageUnits.businessObjectFormatVersion,
        this.data.multipleStorageUnits.partitionValue, 0, true)),

      this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
        this.data.defaultNamespace,
        this.data.bdef.businessObjectDefinitionName,
        this.data.multipleStorageFiles.businessObjectFormatUsage,
        this.data.multipleStorageFiles.businessObjectFormatFileType,
        this.data.multipleStorageFiles.businessObjectFormatVersion,
        this.data.multipleStorageFiles.partitionValue, 0, true)),
      this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
        this.data.defaultNamespace,
        this.data.bdef.businessObjectDefinitionName,
        this.data.singleStorageFile.businessObjectFormatUsage,
        this.data.singleStorageFile.businessObjectFormatFileType,
        this.data.singleStorageFile.businessObjectFormatVersion,
        this.data.singleStorageFile.partitionValue, 0, true)),
      this.dataManager.DMOption(1, new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
        this.data.defaultNamespace,
        this.data.bdef.businessObjectDefinitionName,
        this.data.noStorageFiles.businessObjectFormatUsage,
        this.data.noStorageFiles.businessObjectFormatFileType,
        this.data.noStorageFiles.businessObjectFormatVersion,
        this.data.noStorageFiles.partitionValue, 0, true)),
      this.dataManager.DMOption(2, new schema.BusinessObjectFormats().deleteUrl(
        this.data.defaultNamespace,
        this.data.bdef.businessObjectDefinitionName,
        this.data.formatWithNoSubpartitions.businessObjectFormatUsage,
        this.data.formatWithNoSubpartitions.businessObjectFormatFileType,
        0)),
      this.dataManager.DMOption(3, new schema.BusinessObjectDefinitions().deleteUrl(this.data.defaultNamespace,
        this.data.bdef.businessObjectDefinitionName)),
      this.dataManager.DMOption(4, new schema.DataProvider().deleteUrl(this.data.defaultDataProvider)),
      this.dataManager.DMOption(5, new schema.Namespace().deleteUrl(this.data.defaultNamespace))
    ]
  };
}

  public AWSRequests () {
  const retval = {
    options: []
  };

  retval.options.push(this.aws.S3MOption(this.data.singleStorageFile.storageUnits[0].storageFiles[0].filePath, null));

  retval.options = retval.options.concat(this.data.multipleStorageFiles.storageUnits[0].storageFiles.map( (file) => {
    return this.aws.S3MOption(file.filePath);
  }));

  this.data.multipleStorageUnits.storageUnits.forEach( (unit) => {
    if (unit.storageName === 'S3_MANAGED') {
      retval.options = retval.options.concat(unit.storageFiles.map( (file) => {
        return this.aws.S3MOption(file.filePath);
      }));
    }
  });

  return retval;
}
}

const operations = new  Operations();
export const initRequests = {
  posts: {
    options: operations.postRequests().options
  }
};

export const tearDownRequests = {
  deletes:  {
    options: operations.deleteRequests().options
  }
};


