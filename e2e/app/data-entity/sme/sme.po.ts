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


export class SmePage extends BasePo {

  private _container = element(by.tagName('sd-contacts'));
  private _heading = this._container.element(by.className('inner-header'));
  private _smes = this._container.all(by.className('sme-content'));
  private _jobTitle = this._smes.all(by.className('job-title'));
  private _telephone = this._smes.all(by.className('telephone-number'));
  private _email = this._smes.all(by.partialLinkText('Email'));
  private _message = this._container.element(by.tagName('p'));

  // edit sme po's
  private _smeCards = this._container.all(by.tagName('ngb-alert'));
  private _closeIcon = this._container.element(by.className('close'));
  private _contactInputField = this._container.element(by.name('contact'));
  private _saveButton = this._container.element(by.buttonText('Save'));
  private _doneButton = this._container.element(by.buttonText('Done'));

  get heading(): ElementFinder {
    return this._heading;
  }

  get smes(): ElementArrayFinder {
    return this._smes;
  }

  sme(index): ElementFinder {
    return this._smes.get(index);
  }

  fullName(index): ElementFinder {
    return this.sme(index).element(by.tagName('div'));
  }

  jobTitle(index): ElementFinder {
    return this._jobTitle.get(index);
  }

  telephone(index): ElementFinder {
    return this._telephone.get(index);
  }

  email(index): ElementFinder {
    return this._email.get(index);
  }

  get message(): ElementFinder {
    return this._message;
  }

  get container(): ElementFinder {
    return this._container;
  }

  get closeIcon(): any {
    return this._closeIcon;
  }

  get contactInputField(): any {
    return this._contactInputField;
  }

  get saveButton(): any {
    return this._saveButton;
  }

  get doneButton(): any {
    return this._doneButton;
  }

  get smeCards(): any {
    return this._smeCards;
  }
}
