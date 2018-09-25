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
import { browser } from 'protractor';
import { DataManager } from '../../../../util/DataManager';
import { Operations } from '../operations/operations';
import { Data } from './operations/data';
import { DataObjectDetailPage } from '../data-object-detail.po';
import { BaseDetail } from '../base-detail';


describe('Feature:BDataLineage', () => {

  const constants = require('./../../../../config/conf.e2e.json');
  const baseDetail = new BaseDetail();
  const data = new Data();
  const operations = new Operations();
  const dataManager = new DataManager();
  const page = new DataObjectDetailPage();

  function compareLineageData(given, expected) {
    expect(given.namespace.getText()).toEqual(expected.namespace);
    expect(given.bDefName.getText()).toEqual(expected.bDefName);
    expect(given.schema.getText()).toEqual(expected.schema);
    expect(given.partitionValue.getText()).toEqual(expected.partitionValue);
    expect(given.dataVersion.getText()).toEqual(expected.dataVersion.toString());
    // TODO: there is something wrong where the page object (given) doesn't
    // properly get the subpartitions all the time.  All other fields are fine
    // expect(given.subPartitions.getText()).toEqual(expected.subPartitions);
    expect(given.link.getText()).toEqual(expected.link);
  }

  beforeAll(() => {
    dataManager.setUp(operations.postRequests().options);
    // dataManager.update(operations.updateRequests().options); //  to check for status history
  });

  afterAll(() => {
    dataManager.tearDown(operations.deleteRequests().options);
  });

  beforeEach(() => {
    baseDetail.initiateBrowser(data.bdataChildWithSubpartitionsToHaveChildren, data.formatWithSubpartitions.schema.delimiter);
  });

  describe('StaticContent', () => {
    it('Data details page should display data children when present', async() => {
      //  Check header/subheader values
      expect(await page.childLineageHeaderLabel.getText()).toBe('Children');
      expect(await page.childLineageSectionColumns.getText())
        .toBe('Namespace\nDefinition name\nFormat\nPartition value\nSubPartitions\nVersion');
    });

    it('Data details page should display data parents when present', async() => {
      //  Check header/subheader values
      expect(await page.parentLineageHeaderLabel.getText()).toBe('Parents');
      expect(await page.parentLineageSectionColumns.getText())
        .toBe('Namespace\nDefinition name\nFormat\nPartition value\nSubPartitions\nVersion');
    });

    it('Data details page should display status history', async() => {
      //  Check header/subheader values
      expect(await page.statusHistorySectionLabel.getText()).toBe('Status History');
      const tableSubHeaders = page.statusHistorySectionColumns.getText();
      expect(tableSubHeaders).toContain('Status');
      expect(tableSubHeaders).toContain('Timestamp');
      expect(tableSubHeaders).toContain('User');
    });
  });

  describe('DynamicContent', () => {
    it('Data details page should display correct values with or without subpartitions', async() => {
      const child1 = data.bdataLeafWithoutSubpartitions;
      const child2 = data.bdataLeafWithSubpartitions;
      const parent1 = data.bdataParentWithoutSubpartitions;
      const parent2 = data.bdataParentWithSubpartitions;
      const expectedChild1 = {
        namespace: child1.namespace,
        bDefName: child1.businessObjectDefinitionName,
        schema: [child1.businessObjectFormatUsage, child1.businessObjectFormatFileType, child1.businessObjectFormatVersion].join(':'),
        partitionValue: child1.partitionValue,
        dataVersion: 0,
        subPartitions: child1.subPartitionValues && child1.subPartitionValues.length ?
          child1.subPartitionValues.join(data.formatWithSubpartitions.schema.delimiter) : '',
        link: 'Details'
      };
      const expectedChild2 = {
        namespace: child2.namespace,
        bDefName: child2.businessObjectDefinitionName,
        schema: [child2.businessObjectFormatUsage, child2.businessObjectFormatFileType, child2.businessObjectFormatVersion].join(':'),
        partitionValue: child2.partitionValue,
        dataVersion: 0,
        subPartitions: child2.subPartitionValues && child2.subPartitionValues.length ?
          child2.subPartitionValues.join(data.formatWithSubpartitions.schema.delimiter) : '',
        link: 'Details'
      };
      const expectedParent1 = {
        namespace: parent1.namespace,
        bDefName: parent1.businessObjectDefinitionName,
        schema: [parent1.businessObjectFormatUsage, parent1.businessObjectFormatFileType, parent1.businessObjectFormatVersion].join(':'),
        partitionValue: parent1.partitionValue,
        dataVersion: 0,
        subPartitions: parent1.subPartitionValues && parent1.subPartitionValues.length ?
          parent1.subPartitionValues.join(data.formatWithSubpartitions.schema.delimiter) : '',
        link: 'Details'
      };
      const expectedParent2 = {
        namespace: parent2.namespace,
        bDefName: parent2.businessObjectDefinitionName,
        schema: [parent2.businessObjectFormatUsage, parent2.businessObjectFormatFileType, parent2.businessObjectFormatVersion].join(':'),
        partitionValue: parent2.partitionValue,
        dataVersion: 0,
        subPartitions: parent2.subPartitionValues && parent2.subPartitionValues.length ?
          parent2.subPartitionValues.join(data.formatWithSubpartitions.schema.delimiter) : '',
        link: 'Details'
      };
      //  Check parent and child data alternate key values
      compareLineageData(page.getLineageRowData(page.childLineageRepeater, 0), expectedChild1);
      compareLineageData(page.getLineageRowData(page.childLineageRepeater, 1), expectedChild2);
      compareLineageData(page.getLineageRowData(page.parentLineageRepeater, 0), expectedParent1);
      compareLineageData(page.getLineageRowData(page.parentLineageRepeater, 1), expectedParent2);
    });

    it('Data details page should display correct values with one status value in its history', async() => {
      expect(await page.statusHistoryRepeater.count()).toBe(1);
      // TODO add tests for all columns that are generated
      expect(page.statusHistoryRepeater.first().getText()).toMatch('VALID\n.+\n.+');
    });

    it('Data details page should display correct values with more than one status value in its history', async() => {
      baseDetail.initiateBrowser(data.statusChange, data.formatWithNoSubpartitions.schema.delimiter);

      expect(await page.statusHistoryRepeater.count()).toBe(2);
      expect(page.statusHistoryRepeater.get(0).getText()).toMatch('VALID\n.+\n.+');
      expect(page.statusHistoryRepeater.get(1).getText()).toMatch('UPLOADING\n.+\n.+');
    });
  });

  describe('MissingContent', function () {
    it('Data details page should hide the children table when no children present', async() => {
      baseDetail.initiateBrowser(data.bdataLeafWithoutSubpartitions, data.formatWithNoSubpartitions.schema.delimiter);
      //  Should find zero elements matching the 'Children' table's descriptors
      expect(await page.noChildrenLabel.getText()).toEqual('No children registered.');
    });

    it('Data details page should hide the parents table when no parents present', async() => {
      baseDetail.initiateBrowser(data.bdataParentWithoutSubpartitions, data.formatWithNoSubpartitions.schema.delimiter);
      //  Should find zero elements matching the 'Children' table's descriptors
      expect(page.noParentsLabel.getText()).toContain('No parents registered.');
    });

    it('Data details page should hide both tables when neither parents nor children present', async() => {
      baseDetail.initiateBrowser(data.noLineageBdata, data.formatWithNoSubpartitions.schema.delimiter);

      //  Should find zero elements matching the 'Parents' table's descriptors
      expect(page.noParentsLabel.getText()).toContain('No parents registered.');

      //  Should find zero elements matching the 'Children' table's descriptors
      expect(page.noChildrenLabel.getText()).toContain('No children registered.');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      baseDetail.initiateBrowser(data.bdataChildWithSubpartitionsToHaveChildren, data.formatWithSubpartitions.schema.delimiter);
    });

    it('Data details page should go to correct page when using Details button on child data', async() => {
      page.getLineageRowData(page.childLineageRepeater, 0).link.getAttribute('href').then(function (text) {
        console.log(text);
      });
      page.getLineageRowData(page.childLineageRepeater, 0).link.click();
      browser.getCurrentUrl().then(function (urlText) {
        const expUrl = baseDetail.replaceUrlParams(data.bdataLeafWithoutSubpartitions,
          data.formatWithSubpartitions.schema.delimiter)
          .replace(/ /g, '%20')
          .replace(/\|/g, '%7C')
          // currently partitionkey is not put in the link due to not getting it from the format
          // for the child or parent of a data-objects.  this can be taken out when that changes
          .replace(new RegExp('&partitionKey=' + data.bdataLeafWithoutSubpartitions.partitionKey), '')
          .replace(constants.baseURL, constants.baseURLNoPassword);
        expect(urlText).toEqual(expUrl);
      });
      //  Hit back button
      browser.navigate().back();

      //  Validate that we are on the data-objects page with the correct parameters
      const currentUrl2 = browser.getCurrentUrl();
      const expectedUrl = baseDetail.replaceUrlParams(data.bdataChildWithSubpartitionsToHaveChildren,
        data.formatWithSubpartitions.schema.delimiter)
        .replace(/ /g, '%20')
        .replace(/\|/g, '%7C')
        .replace(constants.baseURL, constants.baseURLNoPassword);
      expect(currentUrl2).toEqual(expectedUrl);
    });

    it('Data details page should go to correct page when using Details button on parent data', async() => {
      page.getLineageRowData(page.parentLineageRepeater, 0).link.getAttribute('href').then(function (text) {
        console.log(text);
      });
      page.getLineageRowData(page.parentLineageRepeater, 0).link.click();
      browser.getCurrentUrl().then(function (urlText) {
        const expectedUrl = baseDetail.replaceUrlParams(data.bdataParentWithoutSubpartitions,
          data.formatWithSubpartitions.schema.delimiter)
          .replace(/ /g, '%20')
          .replace(/\|/g, '%7C')
          // currently partitionkey is not put in the link due to not getting it from the format
          // for the child or parent of a data-objects.  this can be taken out when that changes
          .replace(new RegExp('&partitionKey=' + data.bdataParentWithoutSubpartitions.partitionKey), '')
          .replace(constants.baseURL, constants.baseURLNoPassword);
        expect(urlText).toEqual(expectedUrl);
      });

      //  Hit back button
      browser.navigate().back();

      //  Validate that we are on the data-objects page with the correct parameters
      browser.getCurrentUrl().then(function(urlText) {
        const expectedUrl = baseDetail.replaceUrlParams(data.bdataChildWithSubpartitionsToHaveChildren,
          data.formatWithSubpartitions.schema.delimiter)
          .replace(/ /g, '%20')
          .replace(/\|/g, '%7C')
          .replace(constants.baseURL, constants.baseURLNoPassword);
        expect(urlText).toEqual(expectedUrl);
      });
    });
  });
});
