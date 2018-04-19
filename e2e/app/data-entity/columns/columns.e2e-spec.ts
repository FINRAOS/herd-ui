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
import {ColumnsPage, DataEntityColumnRowData} from './columns.po';
import {browser} from 'protractor';
import {Data} from './operations/data';
import * as ops from './operations/operations'
import {DataManager} from './../../../util/DataManager';

const conf = require('./../../../config/conf.e2e.json');

describe('Bdef Columns Page', () => {
  let page: ColumnsPage;
  const dataManager = new DataManager();
  const data = new Data();
  const _url = conf.dataEntityDetailPath;

  const expectedValues = {
    heading: 'COLUMNS',
    noDescriptiveFormatMessage: 'Cannot display columns - No Descriptive Format defined for this Data Entity',
    noSchemaColumnsMessage: 'Cannot display columns - No Schema columns present in specified Descriptive Format',
    headers: ['Business Name', 'Definition', 'Physical Name', 'Data Type'],
    ddlString: 'CREATE EXTERNAL TABLE',
    data1: {
      businessName: data.bdefColumnName1,
      definition: data.bdefTestDF_FORMAT().schema.columns[0].description,
      dataType: data.bdefTestDF_FORMAT().schema.columns[0].type + ' (' + data.bdefTestDF_FORMAT().schema.columns[0].size + ')',
      physicalName: data.bdefTestDF_FORMAT().schema.columns[0].name
    } as DataEntityColumnRowData,
    data2: {
      businessName: data.bdefColumnName2,
      definition: data.bdefTestDF_FORMAT().schema.columns[1].description,
      dataType: data.bdefTestDF_FORMAT().schema.columns[1].type + ' (' + data.bdefTestDF_FORMAT().schema.columns[1].size + ')',
      physicalName: data.bdefTestDF_FORMAT().schema.columns[1].name
    } as DataEntityColumnRowData
  };


  const namespace = data.defaultNamespace;
  const dataProvider = data.defaultDataProvider;

  beforeEach(() => {
    page = new ColumnsPage();
  });

  it('schema columns without descriptive format', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestNoDF().businessObjectDefinitionName);
    await page.columnsTab.click();
    await expect((await page.columnsTab.getText()).trim()).toBe(expectedValues.heading);
    await expect((await page.message.getText()).trim()).toBe(expectedValues.noDescriptiveFormatMessage);
  });

  it('no schema columns for descriptive format', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestDFNoSchema().businessObjectDefinitionName);
    await page.columnsTab.click();
    await expect((await page.columnsTab.getText()).trim()).toBe(expectedValues.heading);
    await expect((await page.message.getText()).trim()).toBe(expectedValues.noSchemaColumnsMessage);
  });

  it('schema columns with bdef columns ', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestDF().businessObjectDefinitionName);
    await page.columnsTab.click();
    await expect((await page.columnsTab.getText()).trim()).toBe(expectedValues.heading + ' (2)');
    await expect(await page.columnHeaders.getText()).toEqual(expectedValues.headers);

    await expect(page.getRowData(0)).toEqual(expectedValues.data1);
    await expect(page.getRowData(1)).toEqual(expectedValues.data2);
  });

  it('generate DDL functionality test using schema with bdef columns and partitions', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestDFSchemaWith_Partitions().businessObjectDefinitionName);
    await page.columnsTab.click();
    await expect((await page.columnsTab.getText()).trim()).toBe(expectedValues.heading + ' (2)');
    // Validate the generateDDL is present
    await expect(page.generateDDL.isPresent()).toBe(true);
    // Validate the generateDDL button is clickable
    await page.generateDDL.click();
    // Validate the pop up window is generated with the query
    await expect(page.generateDdlText.getText()).toContain(expectedValues.ddlString);

    // Validate the Copy button
    await page.generateDdlCopy.click();

    // ie causes an alert for allowed programmatic copying of data.  this dismisses that.
    if (process.env.CURRENT_BROWSER === 'ie') {
      await browser.switchTo().alert().accept();
    }

    // TODO: add validation logic here.
    // detecting color no longer works and for some reason unable to get app notifications in the driver instances.

    await page.generateDdlClose.click();
  });

  it('generate DDL functionality test using schema with bdef columns and without partitions', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.bdefTestDF().businessObjectDefinitionName);
    await page.columnsTab.click();
    await expect((await page.columnsTab.getText()).trim()).toBe(expectedValues.heading + ' (2)');

    // Validate the error message to be present in the pop up window when generate DDL button is clicked
    await page.generateDDL.click();
    await expect(page.generateDdlError.getText()).toContain('Info: No schema partitions specified for business object format');
    await page.generateDdlClose.click();
  });


  // TODO change this suite to not setup its own data when we change the
  // descriptive info put to allow changing the name as well as the description
  describe('editable Data Entity Columns', () => {

    beforeAll(() => {
      ops.editableDataSetup();
    });

    afterAll(() => {
      ops.editableDataTearDown();
    });

    it('should not be able to edit column data with out proper credentials', async () => {
      // without permisisons to edit
      await page.navigateTo(_url + '/' + namespace + '/' + data.editColumnBdef.businessObjectDefinitionName,
      conf.noAccessUser, conf.noAccessPassword);

      const expectedRow: DataEntityColumnRowData = {
        businessName: '',
        physicalName: data.editableColumnsFormat.schema.columns[0].name,
        dataType: data.editableColumnsFormat.schema.columns[0].type +
        ' (' + data.editableColumnsFormat.schema.columns[0].size + ')',
        definition: ''
      };

      await expect(page.getRowData(0)).toEqual(expectedRow);

      await expect(page.canEditColumns()).toBe(false);
    });

    it('should be able to edit column data with proper credentials', async () => {
      // default test credentials can edit
      await page.navigateTo(_url + '/' + namespace + '/' + data.editColumnBdef.businessObjectDefinitionName);

      const nameEdit = process.env.CURRENT_BROWSER + ' name edit 1';
      const definitionEdit = process.env.CURRENT_BROWSER + ' definition edit 1';
      const definitionEdit2 = process.env.CURRENT_BROWSER + ' definition edit 2';

      const rowEdited1: DataEntityColumnRowData = {
        businessName: nameEdit,
        physicalName: data.editableColumnsFormat.schema.columns[0].name,
        dataType: data.editableColumnsFormat.schema.columns[0].type +
        ' (' + data.editableColumnsFormat.schema.columns[0].size + ')',
        definition: ''
      };

      const rowEdited2 = { ...rowEdited1, definition: definitionEdit };
      const rowEdited3 = { ...rowEdited1, definition: definitionEdit2 };

      await page.editDataEntityColumnName(0, nameEdit);
      await expect(page.getRowData(0)).toEqual(rowEdited1);

      await page.editDataEntityColumnDefinition(0, definitionEdit);
      await expect(page.getRowData(0)).toEqual(rowEdited2);

      await page.editDataEntityColumnDefinition(0, definitionEdit2);
      await expect(page.getRowData(0)).toEqual(rowEdited3);
    });
  });






});
