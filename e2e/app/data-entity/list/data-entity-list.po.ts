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
import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { BasePo } from '../../base/base.po';


export class DataEntityListPage extends BasePo {


    public contentHeader: ElementFinder = element(by.className('content-header'));
    public heading: ElementFinder  = this.contentHeader.element(by.tagName('h1'));
    public subHeading: ElementFinder  = this.contentHeader.element(by.tagName('h4'));

    public dataEntityRow: ElementArrayFinder = element.all(by.className('data-entity-row'));
    public name: ElementFinder  = this.dataEntityRow.get(0).element(by.tagName('h4'));
    public namespaceContainer: ElementFinder  = this.dataEntityRow.get(0).element(by.tagName('h6'));

    public namespaceLabel: ElementFinder = this.namespaceContainer.all(by.tagName('span')).get(0);
    public namespace: ElementFinder = this.namespaceContainer.all(by.tagName('span')).get(1);

    public link: ElementFinder = this.dataEntityRow.get(0).element(by.tagName('a'));

    public searchBox = element(by.tagName('input'));
}
