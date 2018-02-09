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
import {browser} from 'protractor';

export class BaseDetail {
  private constants = require('../../../config/conf.e2e.json');

  public async initiateBrowser(bdata, delimiter?, version?, dataObjectrow?) {
    // await browser.get(this.dataObjectListUrl(bdata));
    // await this.page.dataObjectPage(dataObjectrow).click();
    await browser.get(this.replaceUrlParams(bdata, delimiter, version));
  };

  public dataObjectListUrl(bdata) {
    return this.constants.bdataListPath
      .replace('{namespace}', bdata.namespace)
      .replace('{definitionName}', bdata.businessObjectDefinitionName)
      .replace('{usage}', bdata.businessObjectFormatUsage)
      .replace('{fileType}', bdata.businessObjectFormatFileType)
      .replace('{formatVersion}', bdata.businessObjectFormatVersion)
  }

  // http://localhost:4200/data-objects/PERFDATASEARCH/PERFDATA/DDLDATA/TXT/0/PERKEY10002/0;subPartitionValues=test1%7Cthing2
  public replaceUrlParams(bdata, delimiter, version?) {
    const ttb = this.constants.bdataDetailPath
      .replace('{namespace}', bdata.namespace)
      .replace('{definitionName}', bdata.businessObjectDefinitionName)
      .replace('{usage}', bdata.businessObjectFormatUsage)
      .replace('{formatVersion}', bdata.businessObjectFormatVersion)
      .replace('{fileType}', bdata.businessObjectFormatFileType)
      .replace('{dataVersion}', version || 0)
      .replace('{partitionValue}', bdata.partitionValue)
      .replace('{subPartitions}',
        bdata.subPartitionValues && bdata.subPartitionValues.length ? 'subPartitionValues='
          + bdata.subPartitionValues.join('%7C') : '');
    return ttb;
  }

}
