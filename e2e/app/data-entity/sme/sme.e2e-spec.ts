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
 * we will not check the edit securityFunction in the functional test as it covered in unit test
 * The test pyramid is to maku most covered in i=unit test and what ever is really required for e2e are here.
 */
import {SmePage} from './sme.po';
import {browser} from 'protractor';
import {Data} from './operations/data';
import {DataManager} from './../../../util/DataManager';

const conf = require('./../../../config/conf.e2e.json');
const operations = require('./operations/operations');
const data = new Data();

describe('displaying sme details and edit', () => {
  let page: SmePage;
  const dataManager = new DataManager();
  const _url = conf.dataEntityDetailPath;
  const namespace = data.defaultNamespace;
  const expectedValues = {
    heading: 'Contacts',
    unavailable_message: 'No contacts listed for this Data Entity',
  }

  beforeAll(function () {
    // set up initial data
    const requests = operations.postRequests();
    dataManager.setUp(requests.options);
  });

  afterAll(function () {
    // delete initial data
    const requests = operations.deleteRequests();
    dataManager.tearDown(requests.options);
  });

  beforeEach(() => {

    page = new SmePage();
  });

  it('should render multiple SMEs when present', () => {
    page.navigateTo(_url + '/' + namespace + '/' + data.defaultBdef().businessObjectDefinitionName);
    validate(4);
  });

  it('should render other valid SMEs when one of them is invalid', () => {
    page.navigateTo(_url + '/' + namespace + '/' + data.badBdef().businessObjectDefinitionName);
    validate(2);
  });

  it('should render no SMEs when they are no associated SMEs', () => {
    page.navigateTo(_url + '/' + namespace + '/' + data.emptyBdef().businessObjectDefinitionName);
    validate(0);
    expect(page.message.getText()).toBe(expectedValues.unavailable_message);
  });

  it('should activate edit smes mode and delete contact on click of close("x") icon',  () => {
    page.navigateTo(_url + '/' + namespace + '/' + data.defaultBdef().businessObjectDefinitionName);
    page.container.click();
    expect(page.container).toBeDefined();
    page.closeIcon.click();
    expect(page.smeCards.count()).toBe(1);
  });

  it('should add new sme on submit of new sme', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.defaultBdef().businessObjectDefinitionName);
    await page.container.click();
    await expect(page.container).toBeDefined();
    await page.contactInputField.click();
    await page.contactInputField.sendKeys(conf.smes[0].userId);
    await page.saveButton.click();
    await expect(page.smeCards.count()).toBe(2);
  });

  it('should not add any sme on providing invalid user id', async () => {
    await page.navigateTo(_url + '/' + namespace + '/' + data.defaultBdef().businessObjectDefinitionName);
    await page.container.click();
    await expect(page.container).toBeDefined();
    await page.contactInputField.click();
    await page.contactInputField.sendKeys('invalid-user-id');
    await page.saveButton.click();
    // the count will still be 2 as invalid id will not be added.
    await expect(page.smeCards.count()).toBe(2);
  });

  async function validate(count) {
    await expect(page.heading.getText()).toBe(expectedValues.heading);
    await expect(page.smes.count()).toBe(count);
    for (let i = 1; i < count; i++) {
      await expect(page.fullName(i).getText()).toBe(conf.smes[i].fullName);
      await expect(page.jobTitle(i).getText()).toBe(conf.smes[i].jobTitle);
      await expect(page.telephone(i).getText()).toBe('P: ' + conf.smes[i].phoneNumber);
      await expect(page.email(i).getAttribute('href')).toBe('mailto:' + conf.smes[i].email);
    }
  }

});

