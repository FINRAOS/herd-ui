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
import {FormatPage} from './format.po';
import {browser} from 'protractor';
import {Data} from './operations/data';
import {DataManager} from './../../util/DataManager';

const operations = require('./operations/operations');
const data = new Data();

describe('Format page:', () => {
  const conf = require('../../config/conf.e2e.json');
  const dataManager = new DataManager();
  const formatPageUrl = conf.formatPage;
  let page: FormatPage;
  let version;
  const expectedValues = {
    title: 'FORMAT',
    physicalNameText: 'Physical Name:',
    overviewSubHeaderLabels: ['Description', 'Details', 'Partitions', 'Other Attributes'],
    noMinMaxValue: 'No data registered',
    noPartitions: 'No partition columns registered.',
    noAttrDefns: 'No attribute definitions registered',
    noUserDefAttr: 'No user-defined attributes registered',
    schemaColsHeader: ['Name', 'Type', 'Size', 'Required?', 'Default Value Description'].join('\n'),
    partitionColsHeader: ['Name', 'Type', 'Size', 'Required?', 'Default Value', 'Description'].join('\n'),
    noColsRegistered: 'No Columns Registered'
  }

  beforeEach(() => {

    page = new FormatPage();
  });

   beforeAll(function () {
    const requests = operations.postRequests();
    dataManager.setUp(requests.options);
  });

  afterAll(function () {
    const requests = operations.deleteRequests();
    dataManager.tearDown(requests.options);
  });

  it('format with no optional data and version 0', async () => {
    version = 0;
    const format = data.bformat2();
    const urlParams = [format.namespace,
    format.businessObjectDefinitionName,
    format.businessObjectFormatUsage,
    format.businessObjectFormatFileType, version].join('/');
    await page.navigateTo(formatPageUrl + urlParams);
    await validate(format, 'TEST_1', 'TEST_2');

    // Partitions and other attributes message
    await expect(page.partitionsUnavailable.getText()).toEqual(expectedValues.noPartitions);
    await expect(page.attrDefnUnavailable.getText()).toEqual(expectedValues.noAttrDefns);
    await page.userDefinedAttrTab.click();
    await expect(page.userDefnUnavailable.getText()).toEqual(expectedValues.noUserDefAttr);

    // validate schema columns
    await page.columnsTab.click();
    await expect(page.schemaColumnsHeader.getText()).toEqual(expectedValues.schemaColsHeader);
    await expect(page.schemaColumnsEmptyMessage.getText()).toEqual(expectedValues.noColsRegistered);

});

  it('format with all data except partitions and version 1', async () => {
    version = 1;
    const format = data.bformat21();
    const urlParams = [format.namespace,
    format.businessObjectDefinitionName,
    format.businessObjectFormatUsage,
    format.businessObjectFormatFileType, version].join('/');
    await page.navigateTo(formatPageUrl + urlParams);
    await validate(format, expectedValues.noMinMaxValue, expectedValues.noMinMaxValue);


    // Partitions and other attributes message
    await expect(page.partitionsUnavailable.getText()).toEqual(expectedValues.noPartitions);
    await expect(page.attrDefnColsHeader.getText()).toEqual('Name\nPublished');
    await page.userDefinedAttrTab.click();
    await expect(page.userDefnColsHeader.getText()).toEqual('Name\nValue');

    // validate schema columns
    await page.columnsTab.click();
    await browser.sleep(1000);
    await expect(page.schemaColumnsHeader.getText()).toEqual(expectedValues.schemaColsHeader);
    await expect(page.schemaColData1.getText()).toEqual('TRADE_ID VARCHAR 10 false ABC\nTechnical notes:\nthis is a test column');
    await expect(page.schemaColData2.getText()).toEqual('TRADE_CODE NUMBER');

    await page.overviewTab.click();
    await browser.sleep(1000);
    await expect(page.getAllVersions.getText()).toEqual(['0', '1']);

    // change the drop down to version 0 and call validate again
    await page.getAllVersions.get(0).click();
    version = 0;
    await validate(data.bformat2(), 'TEST_1', 'TEST_2');

});

 it('format with partitions data', async () => {
    version = 0;
    const format = data.bformat1();
    const urlParams = [format.namespace,
    format.businessObjectDefinitionName,
    format.businessObjectFormatUsage,
    format.businessObjectFormatFileType, version].join('/');
    await page.navigateTo(formatPageUrl + urlParams);
    await validate(format, 'TEST_1', '');

    // partition columns
    await expect(page.partitionColumnsHeader.getText()).toEqual(expectedValues.partitionColsHeader);
    await expect(page.partitionColumnsData.count()).toEqual(2);
    await expect(page.partitionColumnsData.get(0).getText()).toEqual(['TEST_KEY', 'VARCHAR', '20', 'true', 'XYZ',
    'this is a test partition'].join('\n'));
    await expect(page.partitionColumnsData.get(1).getText()).toEqual(['MARKET_KEY', 'VARCHAR', '5', 'true', 'OOPS',
    'this is another test partition'].join('\n'));
 });

  async function validate(format, minValue, maxValue) {

    // validate required data
    await expect(page.pageTitle.getText()).toBe(expectedValues.title);
    await expect(page.heading.getText()).toBe([format.businessObjectFormatUsage,
    format.businessObjectFormatFileType, version].join(':'));
    await expect(page.physicalNameText.getText()).toBe(expectedValues.physicalNameText);
    await expect(page.dataEntityLink.getText()).toBe(format.businessObjectDefinitionName);
    await expect(page.descBody.getText()).toEqual(format.description);
    await expect(page.overviewSubHeaderLabels.getText()).toEqual(expectedValues.overviewSubHeaderLabels);
    await expect(page.getDetailsGroup(0).getText()).toContain(
      ['Namespace:', format.namespace,
        'Usage:', format.businessObjectFormatUsage,
        'Format:', format.businessObjectFormatFileType,
        'Version:'].join('\n'));
    if (format.schema) {
      await expect(page.getDetailsGroup(1).getText()).toEqual(
        ['Null Value:', format.schema.nullValue,
          'Delimiter:', format.schema.delimiter,
          'Escape Character:', format.schema.escapeCharacter,
          'Partition Key Group:', format.schema.partitionKeyGroup].join('\n'));
    } else {
      await expect(page.getDetailsGroup(1).getText()).toEqual(
        ['Null Value:',
          'Delimiter:',
          'Escape Character:',
          'Partition Key Group:'].join('\n'));
    }

   if (maxValue !== '') {
    await expect(page.getDetailsGroup(2).getText()).toContain(
      ['Partition:', format.partitionKey,
        'Min Value:', minValue,
        'Max Value:', maxValue].join('\n'));
   }else {
       await expect(page.getDetailsGroup(2).getText()).toContain(
      ['Partition:', format.partitionKey,
        'Min Value:', minValue,
        'Max Value:'].join('\n'));
   }

  }
});
