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
import { Data } from './operations/data';
import { DataManager } from './../../util/DataManager';
import { CategoryPage } from './categories.po';

const conf = require('./../../config/conf.e2e.json');
const data = new Data();

describe('Categories Page', () => {
  let page: CategoryPage;
  const searchTerm = 'test';
  const searchTermAgain = 'sedan';
  const dataManager = new DataManager();
  const _url = conf.categoryDetailPath;
  const expectedValues = {
    pageHeading: 'CATEGORY',
    relatedCategoriesHeading: 'Related Categories',
    unavailableMessage: 'No related data entities registered.'
  };
  const namespace = data.defaultNamespace;
  const dataProvider = data.defaultDataProvider;


  beforeEach(() => {
    page = new CategoryPage();
  });

  it('Root tag with child', async () => {
    await page.navigateTo(_url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[3].code + '/');
    await validate();
    await expect(page.categoryName.getText()).toBe(data.tagTypeCode().tags[3].displayName);
    await expect(page.currentTag.getText()).toBe(data.tagTypeCode().tags[3].displayName);
    await expect(page.tagParent.getText()).toEqual(data.tagTypeCode().tags[0].displayName);
    await expect((await page.tagChildren.getText()).trim()).toEqual(data.tagTypeCode().tags[4].displayName);

    // validate child tag link
    await page.tagChildren.click();
    await expect(browser.getCurrentUrl())
      .toBe(browser.baseUrl + _url + data.tagTypeCode().code + '/' + encodeURIComponent(data.tagTypeCode().tags[4].code));
    await validate();

    // validate parent tag link
    await page.backTrackLink.click();
    await page.tagParent.click();
    await expect(browser.getCurrentUrl()).toBe(browser.baseUrl + _url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[0].code);
    await validate();
    await expect(page.relatedCategoryTitle.getText()).toEqual(expectedValues.relatedCategoriesHeading);
  });

  it('Tag with no child', async () => {
    await page.navigateTo(_url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[2].code + '/');
    await expect(page.categoryName.getText()).toBe(data.tagTypeCode().tags[2].displayName);
    await validate();
  });

  async function validate() {
    await expect(page.heading.getText()).toBe(expectedValues.pageHeading);
    await expect(page.auditDetails.getText()).not.toEqual('');
    return expect(page.desc.getText()).not.toEqual('');
  }

  // if test fails be sure to run on a valid index
  it('Tri state check box is working as expected', async () => {
    let facetCheckBoxes: number;
    let resultCount: number;
    // needed to make sure that the index has refreshed when testing index based things.

    await page.navigateTo(_url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[0].code);
    // there should be 3 bdefs based on data setup
    resultCount = await page.searchResultCount.count();
    // there should be 4 checkboxes base don data setup
    facetCheckBoxes = await page.tristateCheckboxes.count();

    // if the facets and result counts are not correct then the indexes are possibly not valid
    // validate the indexes and then continue the test.
    if (resultCount !== 3 || facetCheckBoxes !== 4) {
      dataManager.validateIndexes();
      await page.navigateTo(_url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[0].code);
    }

    // verify that result count
    let noOfbdefs = await page.searchResultCount.count();
    // TODO: fix test
    // expect(noOfbdefs).toBe(6);
    // include tag that has 2 reults of the 3 expected
    await page.getCheckBoxbyName(data.tagTypeCode().tags[3].displayName).click();
    noOfbdefs = await page.searchResultCount.count();
    expect(noOfbdefs).toBe(3);

    // exclude tag that has 2 reults of the 3 expected
    await page.getCheckBoxbyName(data.tagTypeCode().tags[3].displayName).click();
    noOfbdefs = await page.searchResultCount.count();
    expect(noOfbdefs).toBe(3);

    // include all 3 exclude to see the no bdef selected message.
    await page.getCheckBoxbyName(data.tagTypeCode().tags[4].displayName).click();
    await page.getCheckBoxbyName(data.tagTypeCode().tags[4].displayName).click();
    await page.getCheckBoxbyName(data.tagTypeCode().tags[0].displayName).click();
    await page.getCheckBoxbyName(data.tagTypeCode().tags[0].displayName).click();
    await expect(page.unavailableMessage.getText()).toEqual(expectedValues.unavailableMessage);

  });

  it('number of search result and description is matching', async () => {
    // goes to home page and searches from there
    await page.navigateTo(_url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[3].code + '/');
    await page.search(searchTerm);
    const searchResultUrl = browser.baseUrl + '/categories/'
      + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[3].code + '/' + searchTerm + '?match=';
    await expect(browser.getCurrentUrl()).toBe(await searchResultUrl);

    // verify expected results
    const noOfCards = await page.searchResultCount.count();
    await expect(page.searchResultDescription.getText()).toContain(noOfCards + '');
    await expect(page.searchResultDescription.getText()).toContain(searchTerm);

    // verify the first result functionality
    await expect(page.headingAnchor).toBeDefined();
    await expect(page.headingBadge).toMatch(/('Category' || 'Data Entity')/);

    // Search again to see the search is working
    await page.search(searchTermAgain);
    const searchResultUrlAgain = browser.baseUrl + '/categories/'
      + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[3].code + '/' + searchTermAgain + '?match=';
    await expect(browser.getCurrentUrl()).toBe(await searchResultUrlAgain);
    await expect(page.backTrackLinkArea.getText()).toContain(searchTerm);

  });

  // TODO: fix test
  /*
  it('Hit highlight is showing and working as expected', async () => {
    await page.navigateTo(_url + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[3].code + '/');
    await page.search(searchTerm);
    const searchResultUrl = browser.baseUrl + '/categories/'
      + data.tagTypeCode().code + '/' + data.tagTypeCode().tags[3].code + '/' + searchTerm + '?match=';
    await expect(browser.getCurrentUrl()).toBe(await searchResultUrl);

    // verify that result count is same as displaying
    await expect(page.searchBoxContainer).toBeDefined();
    await expect(page.loadingIcon.isPresent()).toBeFalsy();

    // verify expected results
    await expect(page.highlightFound.getText()).toContain('Found in');
   });
   */

});

