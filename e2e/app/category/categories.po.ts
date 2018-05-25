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
import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { BasePo } from '../base/base.po';
import data from '../search/operations/data';

export class CategoryPage extends BasePo {

  private _relatedCategoriesContainer: ElementFinder = element(by.className('related-categories'));
  private _searchBox = element(by.css('input[placeholder="I can help you to find anything you want!"]'));
  private _searchButton = element(by.css('i.fa.fa-search'));
  private _matchFilterButton = element(by.css('i.fa.fa-filter'));
  private _searchBoxContainer = element(by.css('sd-search'));
  private _hitFilter = element(by.css('sd-global-search .hit-match-filter'));

  // first result verification
  private _loadingIcon = element(by.css('.related-data-entities .sd-text-center'));
  private _searchResultDescription = element(by.css('.related-data-entities .col-9 > div:first-child'));
  private _backTrackLinkArea = element(by.css('.back-track-wrapper .container a'));
  private _searchResultCount = element.all(by.css('.related-data-entities .col-9 .card'));

  // first search result
  private _headingAnchor = element(by.css('.related-data-entities .col-9 .card-header div a'));
  private _headingBadge = element(by.css('.related-data-entities .col-9 .card-header div .badge'));

  // first date entity search result subtitle
  private _dataEntitySubtitle = element(by.className('.related-data-entities .col-9 .card-header div namespace-bdef-subtitle'));

  // hit highlight testing
  private _highlightFound = element.all(by.css('sd-read-more div span span')).first();
  private _highlightReadmoreLink = element(by.css('sd-read-more div a'));

  relatedCategoryTitle: ElementFinder = this._relatedCategoriesContainer.element(by.tagName('h2'));
  tagParent: ElementFinder = this._relatedCategoriesContainer.all(by.className('tag-hierarchy')).get(0).element(by.tagName('a'));
  tagChildren: ElementFinder = this._relatedCategoriesContainer.element(by.className('child-tag')).element(by.tagName('a'));
  currentTag: ElementFinder = this._relatedCategoriesContainer.element(by.className('tag-label-current'));

  facetRefineByText = element(by.css('sd-facet div h5'));
  facetClearLink = element(by.css('sd-facet div a'));

  get matchFilterButton(): ElementFinder {
    return this._matchFilterButton;
  }

  set matchFilterButton(value: ElementFinder) {
    this._matchFilterButton = value;
  }

  get searchBoxContainer(): ElementFinder {
    return this._searchBoxContainer;
  }

  set searchBoxContainer(value: ElementFinder) {
    this._searchBoxContainer = value;
  }

  get hitFilter(): ElementFinder {
    return this._hitFilter;
  }

  set hitFilter(value: ElementFinder) {
    this._hitFilter = value;
  }

  facetCards = element.all(by.css('sd-facet div.card'));
  searchResultCount = element.all(by.css('.related-data-entities .row .col-9 .card'));

  private _tristateCheckboxes = element.all(by.css('sd-tri-state div'));
  unavailableMessage = element(by.className('bdefs-unavailable'));

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

  get searchBox(): ElementFinder {
    return this._searchBox;
  }

  set searchBox(value: ElementFinder) {
    this._searchBox = value;
  }

  get searchButton(): ElementFinder {
    return this._searchButton;
  }

  set searchButton(value: ElementFinder) {
    this._searchButton = value;
  }

  get loadingIcon(): ElementFinder {
    return this._loadingIcon;
  }

  set loadingIcon(value: ElementFinder) {
    this._loadingIcon = value;
  }

  get searchResultDescription(): ElementFinder {
    return this._searchResultDescription;
  }

  set searchResultDescription(value: ElementFinder) {
    this._searchResultDescription = value;
  }

  get backTrackLinkArea(): ElementFinder {
    return this._backTrackLinkArea;
  }

  set backTrackLinkArea(value: ElementFinder) {
    this._backTrackLinkArea = value;
  }

  get tristateCheckboxes(): ElementArrayFinder {
    return this._tristateCheckboxes;
  }

  set tristateCheckboxes(value: ElementArrayFinder) {
    this._tristateCheckboxes = value;
  }

  get headingAnchor(): ElementFinder {
    return this._headingAnchor;
  }

  set headingAnchor(value: ElementFinder) {
    this._headingAnchor = value;
  }

  get headingBadge(): ElementFinder {
    return this._headingBadge;
  }

  set headingBadge(value: ElementFinder) {
    this._headingBadge = value;
  }

  get dataEntitySubtitle(): ElementFinder {
    return this._dataEntitySubtitle;
  }

  set dataEntitySubtitle(value: ElementFinder) {
    this._dataEntitySubtitle = value;
  }

  get highlightFound(): ElementFinder {
    return this._highlightFound;
  }

  set highlightFound(value: ElementFinder) {
    this._highlightFound = value;
  }

  get highlightReadmoreLink(): ElementFinder {
    return this._highlightReadmoreLink;
  }

  set highlightReadmoreLink(value: ElementFinder) {
    this._highlightReadmoreLink = value;
  }

  async search(searchTerm: string) {
    await this.searchBox.click();
    await this.searchBox.clear();
    await this.searchBox.sendKeys(searchTerm);
    return this.searchButton.click();
  }

}

