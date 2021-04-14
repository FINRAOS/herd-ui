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
import { DocumentSchemaPage } from './documentschema.po';
import { Data } from './operations/data';
import { DataManager } from './../../../util/DataManager';

const conf = require('./../../../config/conf.e2e.json');

describe('Bdef Document Schema Page', () => {
  let page: DocumentSchemaPage;
  const dataManager = new DataManager();
  const data = new Data();
  const _url = conf.dataEntityDetailPath;

  const expectedValues = {
    heading: 'DOCUMENT SCHEMA',
    documentSchema: 'Sample document schema',
    documentSchemaUrl: 'Document Schema Url'
  };

  const namespace = data.defaultNamespace;

  beforeEach(() => {
    page = new DocumentSchemaPage();
  });

  it('data entity detail with document schema', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestWithDocumentSchema().businessObjectDefinitionName);
    await page.documentSchemaTab.click();
    await expect((await page.documentSchemaTab.getText()).trim()).toBe(expectedValues.heading);
    await expect(page.documentSchemaContainer.getText()).toEqual('1\n' + expectedValues.documentSchema);
  });

  it('data entity detail with document schema url', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestWithDocumentSchemaUrl().businessObjectDefinitionName);
    await page.documentSchemaTab.click();
    await expect((await page.documentSchemaTab.getText()).trim()).toBe(expectedValues.heading);
    await expect(page.documentSchemaUrlContainer.getText()).toBe(expectedValues.documentSchemaUrl);
    await expect(page.documentSchemaUrlTxtContainer.getText()).toBe(data.documentSchemaUrl);
  });

  it('data entity detail with document schema url in format', async () => {
    const version = 0;
    const format = data.bdefTestWithDocumentSchema_FORMAT();
    const urlParams = [format.namespace,
      format.businessObjectDefinitionName,
      format.businessObjectFormatUsage,
      format.businessObjectFormatFileType, version].join('/');
    await page.navigateTo(conf.formatPage + urlParams);
    await expect(page.documentSchemaFormatTab.isDisplayed()).toBeTruthy();
    await page.documentSchemaFormatTab.click();
    await expect(page.documentSchemaContainer.getText()).toEqual('1\n' + data.bdefTestWithDocumentSchema_FORMAT().documentSchema);
    await expect(page.documentSchemaUrlContainer.getText()).toBe(expectedValues.documentSchemaUrl);
    await expect(page.documentSchemaUrlTxtContainer.getText()).toBe(data.documentSchemaUrl);
  });


  it('data entity detail without document schema', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestNoDocumentSchema().businessObjectDefinitionName);
    // The last tab should not be document schema
    await expect(page.allTabs.last().getText()).toEqual('COLUMNS');
  });

});
