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
import { SearchPage } from './search.po';
import { browser } from 'protractor';
import { BaseE2e } from '../base/base.e2e';
import data from './operations/data';
import { DataManager } from './../../util/DataManager';

const conf = require('./../../config/conf.e2e.json');

describe('Search page', () => {
  const searchTerm = data.searchTerm;
  const dataManager = new DataManager();
  const baseE2e = new BaseE2e();
  let page: SearchPage;

  beforeEach(() => {
    page = new SearchPage();
  });

  it('number of search result and description is matching', async () => {
    // goes to home page and searches from there
    await page.navigateTo();
    await page.search(searchTerm);
    await expect(browser.getCurrentUrl()).toBe(await page.searchResultUrl);

    // verify that result count is same as displaying
    await expect(page.searchBoxContainer).toBeDefined();
    await expect(page.loadingIcon).toBeDefined();

    // verify expected results
    const noOfCards = await page.searchResultCount.count();
    await expect(page.searchResultDescription.getText()).toContain(noOfCards + '');
    await expect(page.searchResultDescription.getText()).toContain(searchTerm);

    // verify the first result functionality
    await expect(page.headingAnchor).toBeDefined();
    await expect(page.headingBadge).toMatch(/('Category' || 'Data Entity')/);
  });

  it('Hit highlight is showing and working as expected', async () => {
    await page.navigateTo();
    await page.search(searchTerm);
    await expect(browser.getCurrentUrl()).toBe(await page.searchResultUrl);

    // verify that result count is same as displaying
    await expect(page.searchBoxContainer).toBeDefined();
    await expect(page.loadingIcon.isPresent()).toBeTruthy();

    // verify expected results
    await expect(page.highlightFound.getText()).toContain('Found in');
  });

  it('Search facets are behaving as expected', async () => {
    await page.navigateTo();
    await page.search(searchTerm);
    await expect(browser.getCurrentUrl()).toBe(await page.searchResultUrl);

    // verify that result count more then zero at least
    await expect(page.facetComponent).toBeDefined();
    await expect(page.facetRefineByText.getText()).toContain('Refine By');
    await expect(page.facetCards.count()).toBeGreaterThan(0);

    // verify the fact show hide
    await page.firstFacetHeader.click();
    await page.firstFacetHeader.click();
    await expect(page.firstFacetBody).toBeDefined();
  });


  it('Tri state check box is working as expected', async () => {
    await page.navigateTo();
    await page.search(searchTerm);
    await browser.sleep(1000);
    // verify that result count more than zero at least
    const noOfCards = await page.searchResultCount.count();
    await page.tristateCheckbox.click();
    await browser.sleep(1000);
    const includedNoOfCards = await page.searchResultCount.count();
    await expect(noOfCards).toBeGreaterThanOrEqual(includedNoOfCards);

    await page.tristateCheckbox.click();
    await browser.sleep(1000);
    const excludedNoOfCards = await page.searchResultCount.count();
    expect(excludedNoOfCards).not.toEqual(includedNoOfCards);
  });

  it('should search with specified match term', async () => {
    await page.navigateTo();
    await page.selectHitMatchType('column');
    await page.search(searchTerm);
    await expect(browser.getCurrentUrl()).toBe(page.searchResultUrl + 'column');
    await expect((await page.hitFilter.getSize()).width).toBeGreaterThan(0);

    // TODO: Possibly add data to verify results.  This may not need to be done because
    // HERD has tests for making sure results are sent back. In which case we just need to make sure
    // that the screen passing the proper parameter because UT's verify the parameter is used with
    // request calls
  });
});
