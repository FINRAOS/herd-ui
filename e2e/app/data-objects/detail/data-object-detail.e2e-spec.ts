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
import {browser, by} from 'protractor';
import {Data} from './operations/data';
import {DataObjectDetailPage} from './data-object-detail.po';
import {BaseDetail} from './base-detail';

const conf = require('./../../../config/conf.e2e.json');
describe('data-objects detail', () => {

  const baseDetail = new BaseDetail();
  const data = new Data();
  const page = new DataObjectDetailPage();

  describe('data-objects detail - heading / partition info / details', async () => {

    beforeEach(async () => {
      await page.navigateTo(baseDetail.replaceUrlParams(data.versionTestV2, null, 0));
    });

    it('static content: BData details page', async () => {
      const bdata = data.versionTestV2;
      const pageTitle = browser.getTitle();
      expect(await pageTitle).toContain(conf.docTitlePrefix + ' - Data Object');

      expect(await page.screenTitle.getText()).toBe('DATA OBJECT');
      expect(await page.keyValueTitle.getText()).toBe(bdata.partitionKey + ': ' + bdata.partitionValue);
      expect(await page.schemaInfoTitle.getText()).toContain('Physical Name');
      expect(await page.schemaInfoTitle.getText()).toContain(bdata.businessObjectDefinitionName);
      expect(await page.schemaInfoTitle.getText()).toContain('Schema');
      expect(await page.schemaInfoTitle.getText()).toContain(
        [bdata.businessObjectFormatUsage, bdata.businessObjectFormatFileType, bdata.businessObjectFormatVersion].join(' :'));

      expect(await page.partitionInfoHeaderLabel.getText()).toBe('Partition Info');
      expect(await page.keyLabel.getText()).toContain('Key');
      expect(await page.valueLabel.getText()).toContain('Value');

      expect(await page.detailsLabels.getText()).toContain('Status');
      expect(await page.detailsLabels.getText()).toContain('Version');
      expect(await page.detailsLabels.getText()).toContain('ID');
    });

    it('partition info: BData details page', async () => {
      expect(await page.partitionValueContainer.getText()).toContain(data.versionTestV2.partitionKey);
      expect(await page.partitionValueContainer.getText()).toContain(data.versionTestV2.partitionValue);

      expect(await page.subPartitionValue.count()).toBe(0);
    });

    it('version info: BData details page', async () => {
      const versionSelector = await page.detailsContainer.element(by.className('version-select'));
      const versionSelectorOptions = versionSelector.all(by.tagName('option'));
      const versionSelectorOptionValues = versionSelectorOptions.getAttribute('ng-reflect-ng-value');
      const versionSelected = versionSelector.getAttribute('ng-reflect-model');
      await expect(page.status.getText()).toBe(data.versionTestV2.status);
      await expect(page.id.getText()).not.toBe('');
      expect(versionSelectorOptionValues).toEqual(['2', '1', '0']);
      expect(versionSelected).toBe('0');
    });


    it('change version: BData details page', async () => {
      // click on the version 1
      const versionSelector = await page.detailsContainer.element(by.className('version-select'));
      await versionSelector.element(by.css('option[ng-reflect-ng-value="1"]')).click();
      await expect(browser.getCurrentUrl()).toContain(baseDetail.replaceUrlParams(data.versionTestV1, null, 1));
    });

    it('partition info: BData details page', async () => {
      await page.navigateTo(baseDetail.replaceUrlParams(data.bdataWithSubpartitions, '|', 0));
      for (let i = 0; i < 4; i++) {
        await expect(page.partitionInfoContainer.getText())
          .toContain(data.formatWithSubpartitions.schema.partitions[i].name.toString());
        await expect(page.partitionInfoContainer.getText())
          .toContain(data.bdataWithSubpartitions.subPartitionValues[i].toString());
      }
    });

  });

  describe('attributes info: BData details page', () => {

    beforeEach(async () => {
      await page.navigateTo(baseDetail.replaceUrlParams(data.versionTestV2, null, 1));
    });

    it('Data attributes values are populated', async () => {
      // Validate that there are two rows
      await expect(page.userDefAttributesTableRows.count()).toEqual(1);
    });

    it('Data attributes registered message displaying correctly when no attributes registered', async () => {
      await expect(page.attributesEmptyMessageLabel.getText()).toBe('No user-defined attributes registered');
    });

  });

});
