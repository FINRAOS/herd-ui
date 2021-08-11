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
import { by, element } from 'protractor';
import { BasePo } from '../base/base.po';
import data from './operations/data';

export class HomePage extends BasePo {
  expectedTagType1 = {
    tagTypeName: data.tagTypeCode1().displayName,
    tagNames: [data.tagTypeCode1().tags[0].displayName, data.tagTypeCode1().tags[3].displayName, data.tagTypeCode1().tags[2].displayName]
  };
  expectedTagType2 = {
    tagTypeName: data.tagTypeCode2().displayName,
    tagNames: [data.tagTypeCode2().tags[0].displayName, data.tagTypeCode2().tags[2].displayName]
  };
  expectedTagType3 = {
    tagTypeName: data.tagTypeCode3().displayName,
    tagNames: [data.tagTypeCode3().tags[0].displayName, data.tagTypeCode3().tags[1].displayName, data.tagTypeCode3().tags[2].displayName]
  };
  expectedTagType4 = {
    tagTypeName: data.tagTypeCode4().displayName,
    tagNames: [data.tagTypeCode4().tags[0].displayName,
      data.tagTypeCode4().tags[1].displayName,
      data.tagTypeCode4().tags[2].displayName,
      data.tagTypeCode4().tags[3].displayName]
  };
  expectedTagType5 = {
    tagTypeName: data.tagTypeCode5().displayName,
    tagNames: [data.tagTypeCode5().tags[0].displayName,
      data.tagTypeCode5().tags[1].displayName,
      data.tagTypeCode5().tags[2].displayName,
      data.tagTypeCode5().tags[3].displayName,
      data.tagTypeCode5().tags[4].displayName,
      data.tagTypeCode5().tags[5].displayName,
      data.tagTypeCode5().tags[6].displayName]
  };
  expectedTagType6 = {
    tagTypeName: data.tagTypeCode6().displayName,
    tagNames: [data.tagTypeCode6().tags[0].displayName,
      data.tagTypeCode6().tags[1].displayName,
      data.tagTypeCode6().tags[2].displayName,
      data.tagTypeCode6().tags[3].displayName]
  };

  expectedData = [
    this.expectedTagType1,
    this.expectedTagType2,
    this.expectedTagType3,
    this.expectedTagType4,
    this.expectedTagType5,
    this.expectedTagType6
  ];

  getHomePage() {
    return element.all(by.css('.homepage'));
  }

  getHomePageTitle() {
    return element.all(by.css('head > title'));
  }

  getHomePageAllTagTypes() {
    return element.all(by.css('.card > .card-block > h4'));
  }

  getTagTypeCategoriesContainer(i: number) {
    return element.all(by.className('truncated-content-wrapper')).get(i);
  }

  getTagTypeCategories(i: number) {
    return this.getTagTypeCategoriesContainer(i).all(by.className('card-link'));
  }


  getDataEntityLink() {
    return element(by.css('a[href="/data-entities"]'));
  }

  getHelpIcon() {
    return element(by.css('a[title="Contact Us"]'));
  }

  getSearchTextBox() {
    return element(by.css('input[placeholder="Search UDC..."]'));
  }

  getHeaderLogo() {
    return element(by.tagName('svg'));
  }

  getHomeSearchHeading() {
    return element(by.className('home-search')).element(by.tagName('h2')).getText();
  }

  getHomeSearchSubHeading() {
    return element(by.className('home-search')).element(by.tagName('h5')).getText();
  }

  getTagTypeTooltip(i: number) {
    return element.all(by.css('.card > .card-block')).get(i).element(by.tagName('ngb-tooltip-window'));
  }

}
