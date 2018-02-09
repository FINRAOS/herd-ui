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
import {browser, by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import {BasePo} from '../base/base.po';

export class CategoryPage extends BasePo {

  get heading (): ElementFinder { return element(by.className('detail-header')); }
  get categoryName (): ElementFinder { return element(by.className('detail-title')); }
  get auditDetails (): ElementFinder { return element(by.className('audit-details')); }
  get desc(): ElementFinder {
    return element(by.tagName('sd-truncated-content'));
  }

  private _relatedCategoriesContainer: ElementFinder = element(by.className('related-categories'));
  relatedCategoryTitle: ElementFinder = this._relatedCategoriesContainer.element(by.tagName('h2'));
  tagParent: ElementFinder = this._relatedCategoriesContainer.all(by.className('tag-hierarchy')).get(0).element(by.tagName('a'));
  tagChildren: ElementFinder = this._relatedCategoriesContainer.element(by.className('child-tag')).element(by.tagName('a'));
  currentTag: ElementFinder = this._relatedCategoriesContainer.element(by.className('tag-label-current'));

   facetRefineByText = element(by.css('sd-facet div h5'));
   facetClearLink = element(by.css('sd-facet div a'));
   facetCards = element.all(by.css('sd-facet div.card'));
   searchResultCount = element.all(by.css('.related-data-entities .row .col-9 .card'));

   tristateCheckboxes = element.all(by.css('sd-tri-state div'));
   unavailableMessage = element(by.className('bdefs-unavailable'));

   getCheckBoxbyName(name: string): ElementFinder {
    return element(by.cssContainingText('sd-tri-state div .tri-state-label', name));
   }

}

