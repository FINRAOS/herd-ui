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
import { SearchPage } from '../search/search.po';
import { HomePage } from '../home/home.po';
import { OverviewPage } from '../data-entity/overview/overview.po';
import { FormatPage } from '../format/format.po';
import { CategoryPage } from '../category/categories.po';
import { DataObjectListPage } from '../data-objects/list/data-objects-list.po';
import { DataObjectDetailPage } from '../data-objects/detail/data-object-detail.po';
import { DataEntityListPage } from '../data-entity/list/data-entity-list.po';
import { environment } from '../../../src/environments/environment';

const conf = require('../../config/conf.e2e.json');


describe('Smoke Tests', () => {
  const searchTerm = 'smoketest';
  const searchHeading = environment.brandHeader;
  const searchSubHeading = environment.brandMotto;
  const searchBoxDescription = 'I can help you to find anything you want!';
  const searchResultUrl = browser.baseUrl + '/search/' + searchTerm + '?match=';
  const searchPage = new SearchPage();
  const homePage = new HomePage();
  const dataEntityPage = new  OverviewPage();
  const dataEntityListPage = new  DataEntityListPage();
  const formatPage = new FormatPage();
  const categoryPage = new CategoryPage();
  const dataObjectList = new DataObjectListPage();
  const dataObjectDetailPage = new DataObjectDetailPage();
  // increase jasmine timeout to 5 minutes
  jasmine.DEFAULT_TIMEOUT_INTERVAL  = 300000;

  it('should should display proper headings and category data', async () => {

    console.log(" *** SMOKE *** " + homePage);

    await homePage.navigateTo();

    // validate Home Search Heading
    await expect(homePage.getHomeSearchHeading()).toBe(searchHeading);

    // validate Home Search Sub Heading
    await expect(homePage.getHomeSearchSubHeading()).toBe(searchSubHeading);

    // validate home homePage title
    await expect(homePage.getHomePageTitle().isPresent()).toBeDefined();

    // validate data entity link
    await expect(homePage.getDataEntityLink().isPresent()).toBeDefined();

    // validate help icon
    await expect(homePage.getHelpIcon().isPresent()).toBeDefined();

    // validate search box and search term
    const searchBox = await homePage.getSearchTextBox();
    await expect(searchBox.getAttribute('placeholder')).toBe(searchBoxDescription);
    await searchBox.click();
    await searchBox.clear();
    await searchBox.sendKeys(searchTerm);
    await expect(searchBox.getAttribute('value')).toBe(searchTerm);

    // navigate to search page from home page
    await searchPage.searchButton.click();
    await expect(browser.getCurrentUrl()).toBe(searchResultUrl);

    // navigate to category from search page. this will also validate that elsatic search is connected and working
    // TODO: add categories to smoke test data so we can navigate through pages

    // navigate to data entity from categry page this will also validate that elsatic search is connected and working
    // TODO: setup smoke test po to find smoke test data entity from the category and navigate

    // navigate to format from data entity page
    // TODO: setup smoke test po to find smoke test format in the data enity and navigate

    // navigate to data objects list from format page
    // TODO: setup smoke test po to click data objects list link from format page

    // navigate to data object detail from data objects list
    // TODO: setup smoke test po to find a specific smoke test data object and navigate to it.

    // hard navigte to data entity list due to it not being in the full base workflow
    await dataEntityListPage.navigateTo(conf.dataEntityDetailPath);
    await expect(browser.getCurrentUrl()).toBe(browser.baseUrl + conf.dataEntityDetailPath);

    // navigate to a data entity from data entity list
    // TODO: Setup smoke po to find smoke test data entity in list and navigate to it.
  });

});
