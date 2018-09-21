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

  // home page search
  private _homePage = element(by.css('.homepage'));
  private _searchBox = element(by.css('input[placeholder="I can help you to find anything you want!"]'));
  private _searchButton = element(by.css('i.fa.fa-search'));
  private _matchFilterButton = element(by.css('i.fa.fa-filter'));
  private _searchBoxContainer = element(by.css('sd-search'));
  private _searchResultUrl = browser.baseUrl + '/search/' + data.searchTerm + '?match=';
  private _hitFilter = element(by.css('sd-global-search .hit-match-filter'));

  // first result verification
  private _loadingIcon = element(by.css('.search-result .sd-text-center'));
  private _searchResultDescription = element(by.css('.search-result .col-9 > div:first-child'));
  private _searchResultCount = element.all(by.css('.search-result .col-9 .card'));

  // first search result
  private _headingAnchor = element(by.css('.search-result .col-9 .card-header div a'));
  private _headingBadge = element(by.css('.search-result .col-9 .card-header div .badge'));

  // first date entity search result subtitle
  private _dataEntitySubtitle = element(by.className('.search-result .col-9 .card-header div namespace-bdef-subtitle'));

  // hit highlight testing
  private _highlightFound = element.all(by.css('sd-read-more div span span')).first();
  private _highlightReadmoreLink = element(by.css('sd-read-more div a'));

  // facets
  private _facetComponent = element(by.css('sd-facet'));
  private _facetRefineByText = element(by.css('sd-facet div h5'));
  private _facetClearLink = element(by.css('sd-facet div a'));
  private _facetCards = element.all(by.css('sd-facet div.card'));

  // first facet verification
  private _firstFacet = element.all(by.css('sd-facet div.card')).first();
  private _firstFacetHeader = this._firstFacet.element(by.css('div.card-header'));
  private _firstFacetBody =  this._firstFacet.element(by.css('div.card-block'));
  private _tristateCheckbox = this._firstFacetBody.element(by.css('ul li:first-child sd-tri-state div'));

  async selectHitMatchType(type: keyof typeof HitMatchTypes | 'all' = 'all') {
    // make sure the match type filter is shown
    if ( (await this.hitFilter.getSize()).height === 0 ) {
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

  get hitFilter(): ElementFinder {
    return this._hitFilter;
  }

  get homePage(): ElementFinder {
    return this._homePage;
  }

  get searchBox(): ElementFinder {
    return this._searchBox;
  }

  get searchButton(): ElementFinder {
    return this._searchButton;
  }

  get searchBoxContainer(): ElementFinder {
    return this._searchBoxContainer;
  }

  get searchResultUrl(): string {
    return this._searchResultUrl;
  }

  get loadingIcon(): ElementFinder {
    return this._loadingIcon;
  }

  get searchResultDescription(): ElementFinder {
    return this._searchResultDescription;
  }

  get searchResultCount(): ElementArrayFinder {
    return this._searchResultCount;
  }

  get headingAnchor(): ElementFinder {
    return this._headingAnchor;
  }

  get headingBadge(): ElementFinder {
    return this._headingBadge;
  }

  get highlightFound(): ElementFinder {
    return this._highlightFound;
  }

  get highlightReadmoreLink(): ElementFinder {
    return this._highlightReadmoreLink;
  }

  get facetComponent(): ElementFinder {
    return this._facetComponent;
  }

  get facetRefineByText(): ElementFinder {
    return this._facetRefineByText;
  }

  get facetClearLink(): ElementFinder {
    return this._facetClearLink;
  }

  get facetCards(): ElementArrayFinder {
    return this._facetCards;
  }

  get firstFacetHeader(): ElementFinder {
    return this._firstFacetHeader;
  }

  get firstFacetBody(): ElementFinder {
    return this._firstFacetBody;
  }

  get tristateCheckbox(): ElementFinder {
    return this._tristateCheckbox;
  }

  get matchFilterButton(): ElementFinder {
    return this._matchFilterButton;
  }
}
