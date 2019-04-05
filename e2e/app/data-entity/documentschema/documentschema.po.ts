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
import {by, element, ElementFinder, ElementArrayFinder} from "protractor";
import {OverviewPage} from "../overview/overview.po";

export class DocumentSchemaPage extends OverviewPage {
  private _container = element(by.id('ngb-tab-2'));

  // document schema
  public documentSchemaContainer = element(by.className('document-schema'));

  public documentSchemaUrlContainer = element(by.css('.tab-contents > .col-9 > .sub-header-label'));
  public documentSchemaUrlTxtContainer = element(by.css('.tab-contents > .col-9 p'));

  get documentSchemaFormatTab(): ElementFinder {
    return this._tabs.all(by.tagName('li')).get(3).element(by.tagName('a'));
  }
  get documentSchemaTab(): ElementFinder {
    return this._tabs.all(by.tagName('li')).get(2).element(by.tagName('a'));
  }

  get allTabs(): ElementArrayFinder {
    return this._tabs.all(by.tagName('li'));
  }

}

