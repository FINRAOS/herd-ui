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
import { DataEntityListPage } from './data-entity-list.po';
import {browser, protractor} from 'protractor';
import {Data} from './operations/data';
import {DataManager} from './../../../util/DataManager';
const conf = require('./../../../config/conf.e2e.json');
const operations = require('./operations/operations');

describe('Data Entity List Page', () => {
  let page: DataEntityListPage;
  const dataManager = new DataManager();
  const data = new Data();
  const _url = conf.dataEntityDetailPath;
  const expectedValues = {
    pageHeading: 'Data Entities',
    placeholder: 'Enter a namespace or data entity name.',
    namespaceLabel: 'Namespace:',
    showingOne: 'Showing 1 of ',
    linkText: 'View Data Entity'
  }

  beforeEach(() => {
    page = new DataEntityListPage();
  });

   it('static header and data populated correctly', async () => {
       await page.navigateTo(_url);
       await expect((await browser.getTitle()).trim()).toEqual(page.baseTitle + page.dataEntitiesTitle);
       await expect((await page.heading.getText()).trim()).toEqual(expectedValues.pageHeading);
       await expect(page.searchBox.getAttribute('placeholder')).toBe(expectedValues.placeholder);
       await page.searchBox.clear();
       await page.searchBox.sendKeys(data.defaultBdefName);
       await validate();

       // validate back tracking
       await page.link.click();
       await expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + _url + '/' +
        data.defaultNamespace + '/' + data.defaultBdefName);
       await expect((await page.backTrackLink.getText()).trim()).toEqual(page.dataEntitiesTitle);
       await page.backTrackLink.click();
       await validate();
  });

    async function validate() {
       await expect((await page.namespaceLabel.getText()).trim()).toEqual(expectedValues.namespaceLabel);
       await expect(page.dataEntityRow.count()).toEqual(1);
       await expect((await page.namespace.getText()).trim()).toEqual(data.defaultNamespace);
       await expect(page.subHeading.getText()).toContain(expectedValues.showingOne);
       await expect((await page.link.getText()).trim()).toEqual(expectedValues.linkText);
       await expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + _url + '?searchTerm=' + data.defaultBdefName);
    }
});

