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
import data from './operations/data';
import { HitMatchTypes } from 'app/shared/services/search.service';

const conf = require('../../config/conf.e2e.json');

export class SearchPage extends BasePo {

  // first date entity search result subtitle
  private _dataEntitySubtitle = element(by.className('.search-result .col-9 .card-header div namespace-bdef-subtitle'));
  // first facet verification
  private _firstFacet = element.all(by.css('sd-facet div.card')).first();

  // home page search
  private _homePage = element(by.css('.homepage'));

  get homePage(): ElementFinder {
    return this._homePage;
  }

  private _searchBox = element(by.css('input[placeholder="Search UDC..."]'));

  get searchBox(): ElementFinder {
    return this._searchBox;
  }

  private _searchButton = element(by.css('i.fa.fa-search'));

  get searchButton(): ElementFinder {
    return this._searchButton;
  }

  private _matchFilterButton = element(by.css('i.fa.fa-filter'));

  get matchFilterButton(): ElementFinder {
    return this._matchFilterButton;
  }

  private _searchBoxContainer = element(by.css('sd-search'));

  get searchBoxContainer(): ElementFinder {
    return this._searchBoxContainer;
  }

  private _searchResultUrl = browser.baseUrl + '/search/' + data.searchTerm + '?match=';

  get searchResultUrl(): string {
    return this._searchResultUrl;
  }

  private _hitFilter = element(by.css('sd-global-search .hit-match-filter'));

  get hitFilter(): ElementFinder {
    return this._hitFilter;
  }

  // first result verification
  private _loadingIcon = element(by.css('.search-result .sd-text-center'));

  get loadingIcon(): ElementFinder {
    return this._loadingIcon;
  }

  private _searchResultDescription = element(by.css('.search-result .col-9 > div:first-child'));

  get searchResultDescription(): ElementFinder {
    return this._searchResultDescription;
  }

  private _searchResultCount = element.all(by.css('.search-result .col-9 .card'));

  get searchResultCount(): ElementArrayFinder {
    return this._searchResultCount;
  }

  // first search result
  private _headingAnchor = element(by.css('.search-result .col-9 .card-header div a'));

  get headingAnchor(): ElementFinder {
    return this._headingAnchor;
  }

  private _headingBadge = element(by.css('.search-result .col-9 .card-header div .badge'));

  get headingBadge(): ElementFinder {
    return this._headingBadge;
  }

  // hit highlight testing
  private _highlightFound = element.all(by.css('sd-read-more div span span')).first();

  get highlightFound(): ElementFinder {
    return this._highlightFound;
  }

  private _highlightReadmoreLink = element(by.css('sd-read-more div a'));

  get highlightReadmoreLink(): ElementFinder {
    return this._highlightReadmoreLink;
  }

  // facets
  private _facetComponent = element(by.css('sd-facet'));

  get facetComponent(): ElementFinder {
    return this._facetComponent;
  }

  private _facetRefineByText = element(by.css('sd-facet div h5'));

  get facetRefineByText(): ElementFinder {
    return this._facetRefineByText;
  }

  private _facetClearLink = element(by.css('sd-facet div a'));

  get facetClearLink(): ElementFinder {
    return this._facetClearLink;
  }

  private _facetCards = element.all(by.css('sd-facet div.card'));

  get facetCards(): ElementArrayFinder {
    return this._facetCards;
  }

  private _firstFacetHeader = this._firstFacet.element(by.css('div.card-header'));

  get firstFacetHeader(): ElementFinder {
    return this._firstFacetHeader;
  }

  private _firstFacetBody = this._firstFacet.element(by.css('div.card-block'));

  get firstFacetBody(): ElementFinder {
    return this._firstFacetBody;
  }

  private _tristateCheckbox = this._firstFacetBody.element(by.css('ul li:first-child sd-tri-state div'));

  get tristateCheckbox(): ElementFinder {
    return this._tristateCheckbox;
  }

  async selectHitMatchType(type: keyof typeof HitMatchTypes | 'all' = 'all') {
    // make sure the match type filter is shown
    if ((await this.hitFilter.getSize()).height === 0) {
      await this.matchFilterButton.click();
    }

    const hitType = type.charAt(0).toUpperCase() + type.slice(1);
    return this.hitFilter.element(by.cssContainingText('.form-check-label', hitType)).click();
  }

  async search(searchTerm: string) {
    await this.searchBox.click();
    await this.searchBox.clear();
    await this.searchBox.sendKeys(searchTerm);
    return this.searchButton.click();
  }
}
