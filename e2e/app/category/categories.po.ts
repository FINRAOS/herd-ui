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
import { by, element, ElementFinder } from 'protractor';
import { BasePo } from '../base/base.po';

export class CategoryPage extends BasePo {

  private _relatedCategoriesContainer: ElementFinder = element(by.className('related-categories'));

  get relatedCategoryTitle(): ElementFinder {
    return this._relatedCategoriesContainer.element(by.tagName('h2'));
  }

  get tagParent(): ElementFinder {
    return this._relatedCategoriesContainer.all(by.className('tag-hierarchy')).get(0).element(by.tagName('a'));
  }

  get tagChildren(): ElementFinder {
    return this._relatedCategoriesContainer.element(by.className('child-tag')).element(by.tagName('a'));
  }

  get currentTag(): ElementFinder {
    return this._relatedCategoriesContainer.element(by.className('tag-label-current'));
  }

  get searchResultCount() {
    return element.all(by.css('.related-data-entities .row .col-9 .card'));
  }

  get searchBox() {
    return element(by.css('input[placeholder="Search related data entities"]'));
  }

  get searchButton() {
    return element(by.css('i.fa.fa-search'));
  }

  get searchResultDescription() {
    return element(by.css('.related-data-entities .col-9 > div:first-child'));
  }

  get headingAnchor() {
    return element(by.css('.related-data-entities .col-9 .card-header div a'));
  }

  get searchBoxContainer() {
    return element(by.css('sd-search'));
  }

  private _hitFilter = element(by.css('sd-global-search .hit-match-filter'));

  // first result verification
  get loadingIcon() {
    return element(by.css('.related-data-entities .sd-text-center'));
  }

  get backTrackLinkArea() {
    return element(by.css('.back-track-wrapper .container a'));
  }

  // first search result
  get headingBadge() {
    return element(by.css('.related-data-entities .col-9 .card-header div .badge'));
  }

  // hit highlight testing
  get highlightFound() {
    return element.all(by.css('sd-read-more div span span')).first();
  }

  get tristateCheckboxes() {
    return element.all(by.css('sd-tri-state div'));
  }

  get unavailableMessage() {
    return element(by.className('bdefs-unavailable'));
  }

  get heading(): ElementFinder {
    return element(by.className('detail-header'));
  }

  get categoryName(): ElementFinder {
    return element(by.className('detail-title'));
  }

  get auditDetails(): ElementFinder {
    return element(by.className('audit-details'));
  }

  get desc(): ElementFinder {
    return element(by.tagName('sd-truncated-content'));
  }

  getCheckBoxbyName(name: string): ElementFinder {
    return element(by.cssContainingText('sd-tri-state div .tri-state-label', name));
  }

  async search(searchTerm: string) {
    await this.searchBox.click();
    await this.searchBox.clear();
    await this.searchBox.sendKeys(searchTerm);
    return this.searchButton.click();
  }

}

