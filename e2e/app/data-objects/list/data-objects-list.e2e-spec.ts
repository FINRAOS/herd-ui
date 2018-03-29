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

import {DataManager} from '../../../util/DataManager';
import {browser} from 'protractor';
import data from './operations/data';
import {AttributeFilter, DataObjectListPage, LatestValidFilter, PartitionFilter, RowData} from './data-objects-list.po';

const conf = require('./../../../config/conf.e2e.json');
const dm: DataManager = new DataManager();
const page: DataObjectListPage = new DataObjectListPage();

describe('feature: DataObjectList', function () {

    describe('StaticContent', () => {
        beforeAll(async () => {
            await page.navigateTo(conf.bdataListPath.replace('{namespace}', data.formatNoData.namespace)
                .replace('{definitionName}', data.formatNoData.businessObjectDefinitionName)
                .replace('{usage}', data.formatNoData.businessObjectFormatUsage)
                .replace('{fileType}', data.formatNoData.businessObjectFormatFileType)
                .replace('{version}', 0));
        });

        it('should show default empty message when no data objects exist', async () => {
            await expect(page.emptyMessage.getText()).toEqual('No records found');
        });

        it('Data list page should have relevant title', async () => {
            await expect(browser.getTitle()).toBe(conf.docTitlePrefix + ' - Data Objects - ' +
                data.formatNoData.namespace + ' : ' +
                data.formatNoData.businessObjectDefinitionName + ' | ' +
                data.formatNoData.businessObjectFormatUsage + ' : ' +
                data.formatNoData.businessObjectFormatFileType + ' : 0');
        });

        it('Data list page should render correct labels', async () => {
            await expect(page.mainHeader.getText()).toEqual('Data Objects');

            await expect(page.dataEntitySubHeader.getText()).toContain('Physical Name:');
            await expect(page.dataEntitySubHeaderLink.getText()).toEqual(data.formatNoData.businessObjectDefinitionName);
            await expect(page.dataEntitySubHeaderLink.getAttribute('href'))
                .toContain('/data-entities/' + data.formatNoData.namespace + '/' + data.formatNoData.businessObjectDefinitionName);

            await expect(page.formatSubHeader.getText()).toContain('Format:');
            await expect(page.formatSubHeaderLink.getText()).toEqual([
                data.formatNoData.businessObjectFormatUsage,
                data.formatWithData.businessObjectFormatFileType,
                0].join(' : '));
            await expect(page.formatSubHeaderLink.getAttribute('href'))
                .toContain('/formats/' +
                data.formatNoData.namespace + '/' +
                data.formatNoData.businessObjectDefinitionName + '/' +
                data.formatNoData.businessObjectFormatUsage + '/' +
                data.formatNoData.businessObjectFormatFileType + '/' + '0');
        });

        it('has correct label information for adding filters', async () => {
            await expect(page.addFilterButton.getText()).toEqual('Add Filter');
            await page.addFilterButton.click();
            await expect(page.addFilterMenuItems.getText()).toEqual(['Partition', 'Attribute', 'Last Valid Version']);
        });

    });

    describe('Applying Filters', () => {
        beforeAll(async () => {
            await page.navigateTo(conf.bdataListPath.replace('{namespace}', data.formatForFilter.namespace)
                .replace('{definitionName}', data.formatForFilter.businessObjectDefinitionName)
                .replace('{usage}', data.formatForFilter.businessObjectFormatUsage)
                .replace('{fileType}', data.formatForFilter.businessObjectFormatFileType)
                .replace('{version}', 0));
        });

        it('should have data in the list based on format', async () => {
            const expectedData = [data.bdata3, data.bdata2, data.bdata1];
            const config = await browser.getProcessedConfig();
            const count = await page.dataRows.count();
            for (let i = 0; i < count; i++) {
                const rowData = new RowData(await page.dataRows.get(i));
                // should not show attributes or status by default as we do not have the data yet
                await expect(rowData.status.isPresent()).toBe(false);
                await expect(rowData.attributes.isPresent()).toBe(false);
                await expect(rowData.partition.getText()).toEqual(expectedData[i].partitionValue);
                await expect(rowData.version.getText()).toEqual('0');
                await expect(rowData.subPartitions.getText()).toEqual(expectedData[i].subPartitionValues
                    ? expectedData[i].subPartitionValues.join(',') : '');
                const expectedFormat = [expectedData[0].businessObjectFormatUsage,
                expectedData[i].businessObjectFormatFileType, 0].join(' : ');
                await expect(rowData.format.getText()).toEqual(expectedFormat);
                await expect(rowData.link.isPresent()).toEqual(true);
                await expect(rowData.link.isDisplayed()).toEqual(true);

                await rowData.link.click();
                // link should work
                await expect(await browser.getCurrentUrl()).toEqual(config.baseUrl +
                    conf.bdataListPath.replace('{namespace}', data.formatForFilter.namespace)
                    .replace('{definitionName}', data.formatForFilter.businessObjectDefinitionName)
                    .replace('{usage}', data.formatForFilter.businessObjectFormatUsage)
                    .replace('{fileType}', data.formatForFilter.businessObjectFormatFileType)
                    .replace('{version}', 0) + '/' +
                    expectedData[i].partitionValue + '/' +
                    0 + ';subPartitionValues=' +
                    (expectedData[i].subPartitionValues && expectedData[i].subPartitionValues.join('%7C') || ''));
                await browser.navigate().back();
            }
        });

        describe('Attribute Filters', () => {
            it('should have proper labels', async () => {
                const attrFilter = await page.createFilter('attr') as AttributeFilter;

                await expect(attrFilter.nameInput.getAttribute('placeholder')).toEqual('Attribute Name');
                await expect(attrFilter.valueInput.getAttribute('placeholder')).toEqual('Attribute Value');
                await expect(attrFilter.title.getText()).toEqual('Attribute:');
            });
        });
        describe('Partition Filters', () => {
            it('should have proper labels', async () => {
                const prtFilter = await page.createFilter('part') as PartitionFilter;
                await expect(prtFilter.keyInput.getAttribute('placeholder')).toEqual('Partition Key');
                await expect(prtFilter.valueInput.getAttribute('placeholder')).toEqual('Partition Value');
                await expect(prtFilter.minInput.getAttribute('placeholder')).toEqual('Min');
                await expect(prtFilter.maxInput.getAttribute('placeholder')).toEqual('Max');
            });
        });

        describe('Lastest Valid Version Filters', () => {
            it('should have proper labels and get rid of filter when closed', async () => {
                const lvvFilter = await page.createFilter('lvv') as LatestValidFilter;
                await expect(lvvFilter.title.getText()).toEqual('Latest Valid Version');
                await lvvFilter.closeButton.click();
                await expect(lvvFilter.filter.isPresent()).toBe(false);
            });
        });
    });
});
