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
import {ExternalInterfacesPage} from "./externalinterfaces.po";
import {Data} from "./operations/data";
import {DataManager} from "../../../util/DataManager";

const conf = require('./../../../config/conf.e2e.json');
const operations = require('./operations/operations');

describe('External Interface Page', () => {
  let page: ExternalInterfacesPage;
  const dataManager = new DataManager();
  const data = new Data();
  const _url = conf.formatPage;

  const expectedValues = {
    heading: 'EXTERNAL INTERFACES',
    externalInterfacesSubHeader: 'External Interfaces List',
    viewExternalInterfaceString: 'View',
    viewExternalInterfaceWindowTitle: data.displayName + data.defaultExternalInterface,
    viewExternalInterfaceWindowPhysicalName: 'Physical Name: ' + data.defaultExternalInterface,
    viewExternalInterfaceWindowDescriptionBody: 'Sample description text for testing purpose. Used for all description fields',
    viewExternalInterfaceErrorMessage: 'Info: Failed to evaluate velocity template in the external interface'
  };

  const namespace = data.defaultNamespace;
  const dataProvider = data.defaultDataProvider;

  beforeEach(() => {
    page = new ExternalInterfacesPage();
  });

  it('view external interface header', async () => {
    await page.navigateTo(_url + namespace + '/' + data.defaultBdef + '/' + data.defaultFormatUsage + '/' + data.defaultFormatFileType + '/0');
    await page.externalInterfacesTab.click();
    await expect((await page.externalInterfacesTab.getText()).trim()).toBe(expectedValues.heading + ' (2)');
    await expect(page.externalInterfacesSubHeader.getText()).toEqual(expectedValues.externalInterfacesSubHeader);
  });

  it('view external interface window', async () => {
    await page.navigateTo(_url + namespace + '/' + data.defaultBdef + '/' + data.defaultFormatUsage + '/' + data.defaultFormatFileType + '/0');
    await page.externalInterfacesTab.click();
    await expect(page.viewExternalInterface.isPresent()).toBe(true);
    await page.viewExternalInterface.click();
    await expect(page.viewExternalInterface.getText()).toContain(expectedValues.viewExternalInterfaceString);

    await expect (page.viewExternalInterfaceWindowTitle.getText()).toBe(expectedValues.viewExternalInterfaceWindowTitle);
    await expect (page.viewExternalInterfaceWindowPhysicalName.getText()).toBe(expectedValues.viewExternalInterfaceWindowPhysicalName);
    await expect (page.viewExternalInterfaceWindowDescriptionBody.getText()).toBe(expectedValues.viewExternalInterfaceWindowDescriptionBody);

    await page.viewExternalInterfaceClose.click();
  });

  it('view external interface window invalid template', async () => {
    await page.navigateTo(_url + namespace + '/' + data.defaultBdef + '/' + data.defaultFormatUsage + '/' + data.defaultFormatFileType + '/0');
    await page.externalInterfacesTab.click();

    // Validate the error message to be present in the pop up window when view button is clicked
    await expect(page.viewExternalInterfaceInvalid.isPresent()).toBe(true);
    await page.viewExternalInterfaceInvalid.click();
    await expect(page.viewExternalInterfaceError.getText()).toContain(expectedValues.viewExternalInterfaceErrorMessage);

    await page.viewExternalInterfaceClose.click();
  });

});
