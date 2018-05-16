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
import data from './operations/data';
import {DataManager} from './../../util/DataManager';
import {HomePage} from './home.po';
import { environment } from '../../../src/environments/environment';


describe('Feature:HomePage', function () {
  const dataManager = new DataManager();
  const searchTerm = 'home page test';
  const brandHeader = 'Universal Data Catalog';
  const brandMotto = 'Locate and understand data available at FINRA';
  let page: HomePage;

  beforeEach(async () => {
    page = new HomePage();
  });



  it('should should display proper headings and category data', async () => {
    await page.navigateTo();

    // validate Home Search Heading
    await expect(page.getHomeSearchHeading()).toBe(brandHeader);

    // validate Home Search Sub Heading
    await expect(page.getHomeSearchSubHeading()).toBe(brandMotto);

    // validate home page title
    await expect(page.getHomePageTitle().isPresent()).toBeDefined();

    // validate data entity link
    await expect(page.getDataEntityLink().isPresent()).toBeDefined();

    // validate help icon
    await expect(page.getHelpIcon().isPresent()).toBeDefined();

    // validate search box and search term
    const searchBox = await page.getSearchTextBox();
    await expect(searchBox.getAttribute('placeholder')).toBe(data.searchBoxDescription);
    await searchBox.click();
    await searchBox.clear();
    await searchBox.sendKeys(searchTerm);
    await expect(searchBox.getAttribute('value')).toBe(searchTerm);

    // displays top 6 categories by tagOrder
    // we are getting the tagTypeTag containers not the tag types themselves
    const allTagTypes = await page.getHomePageAllTagTypes();
    expect(allTagTypes.length).toBe(6);

    for (let i = 0; i < 6; i++) {
      // validate all the test tagtypes
      await expect(allTagTypes[i].getText()).toContain(page.expectedData[i].tagTypeName);
      await page.mouseEnterShim(allTagTypes[i]);
      // validate all the test tagtypes description
      await expect((await page.getTagTypeTooltip(i).getText()).trim()).toContain(data['tagTypeCode' + (i + 1)]().description);

      // validate the labels of each tagtype category
      await page.mouseOverShim(await page.getTagTypeCategoriesContainer(i));
      const text = await page.getTagTypeCategories(i).getText();

      // so that home page is testable in parallel
      expect(text).toEqual(page.expectedData[i].tagNames);
    }
  });

});
