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
import {by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import {BasePo} from '../../base/base.po';

export class SampleDataPage extends BasePo {
    sideActions: ElementArrayFinder  = element.all(by.tagName('sd-side-action'));
    activeIconColor = 'rgba(255, 255, 255, 1)';
    inactiveIconColor = 'rgba(99, 181, 242, 1)';
    sampleDataButton: ElementFinder = this.sideActions.get(3).element(by.tagName('div'));
    sampleDataButtonColor: ElementFinder = this.sampleDataButton.element(by.tagName('i'));
    watchButton: ElementFinder = this.sideActions.get(2).element(by.tagName('div'));
    watchButtonColor: ElementFinder = this.watchButton.element(by.tagName('i'));
}
