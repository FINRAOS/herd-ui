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
import { browser, by, element, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
import { BasePo } from '../../base/base.po';

export class ExternalInterfacesPage extends BasePo {

    public _container = element(by.className('format-detail'));
    public heading = this._container.element(by.className('detail-title'));

    // tabs
    public _tabs = element.all(by.tagName('ngb-tabset'));
    public externalInterfacesSubHeader = element(by.id('externalInterfacesSubHeader'));

    // External Interface Text Area
    private  _externalInterfaceTextArea = element(by.className('modal-body'));
    // generate external interface window
    private _externalInterfaceWindow = element(by.tagName('ngb-modal-window'));

    get externalInterfacesTab(): ElementFinder {
        return this._tabs.all(by.tagName('li')).get(2).element(by.tagName('a'));
    }

    get viewExternalInterface(): ElementFinder {
        return this._container.all(by.cssContainingText('ngb-tabset .btn-primary', 'View')).get(0);
    }

    get viewExternalInterfaceInvalid(): ElementFinder {
      return this._container.all(by.cssContainingText('ngb-tabset .btn-primary', 'View')).get(1);
    }

    get viewExternalInterfaceClose(): ElementFinder {
        return this._externalInterfaceWindow.element(by.className('modal-header')).element(by.className('close'));
    }

    get viewExternalInterfaceWindowText(): ElementFinder {
        return this._externalInterfaceWindow.element(by.className('modal-body')).all(by.className('CodeMirror-line')).get(0);
    }

    get viewExternalInterfaceWindowTitle(): ElementFinder {
      return this._externalInterfaceWindow.element(by.className('modal-header')).all(by.className('modal-title')).get(0);
    }

    get viewExternalInterfaceWindowPhysicalName(): ElementFinder {
      return this._externalInterfaceWindow.element(by.className('modal-body')).all(by.className('physical-name')).get(0);
    }

    get viewExternalInterfaceWindowDescriptionBody(): ElementFinder {
      return this._externalInterfaceWindow.element(by.className('modal-body')).all(by.className('description-body')).get(0);
    }

    get viewExternalInterfaceError(): ElementFinder {
        return this._externalInterfaceWindow.element(by.className('alert-danger'));
    }
}
