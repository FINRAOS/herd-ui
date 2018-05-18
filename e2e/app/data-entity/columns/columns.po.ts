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
import {browser, by, element, ElementArrayFinder, ElementFinder, protractor} from 'protractor';
import {OverviewPage} from '../overview/overview.po';

export class ColumnsPage extends OverviewPage {
    private _container = element(by.id('columns-panel'));
    private _header = this._container.element(by.className('ui-datatable-thead'));
    private _message = this._container.element(by.className('ui-datatable-emptymessage'));

    // DDL Text Area
    private _ddlTextArea = element(by.className('modal-body'));
    // generate DDL window
    private _ddlWindow = element(by.tagName('ngb-modal-window'));

    get columnHeaders(): ElementArrayFinder {
        return this._header.all(by.css('th .ui-column-title'));
    }

    get message(): ElementFinder {
        return this._message;
    }

    get columnsTab(): ElementFinder {
        return this._tabs.all(by.tagName('li')).get(1).element(by.tagName('a'));
    }

    get generateDDL(): ElementFinder {
        return element(by.cssContainingText('ngb-tabset .btn-primary', 'Generate Format DDL'));
    }

    get generateDdlClose(): ElementFinder {
        return this._ddlWindow.element(by.className('modal-header')).element(by.className('close'));
    }

    get generateDdlText(): ElementFinder {
        return this._ddlWindow.element(by.className('modal-body')).all(by.className('CodeMirror-line')).get(0);
    }

    get generateDdlError(): ElementFinder {
        return this._ddlWindow.element(by.className('alert-danger'));
    }

    get generateDdlCopy(): ElementFinder {
        return this._ddlWindow.element(by.className('modal-footer')).element(by.tagName('button'));
    }

    /**
     * Note: Must have columns in order for this fuction to  be valid
     */
    async canEditColumns(): Promise<boolean> {
        // switch to columns tab if not there.
        await this.columnsTab.click();
        const rows = element.all(by.css('p-datatable tbody > tr')).get(0);

        const nameEditor = await rows.element(by.cssContainingText('td > span.ui-column-title', 'Business Name'))
        .element(by.xpath('following-sibling::span')).element(by.tagName('sd-edit'));

        return this.isDisplayedShim(nameEditor);
    }

    async editDataEntityColumnName(rowIndex: number, name: string): Promise<any> {
        // switch to columns tab if not there
        await this.columnsTab.click();

        const editor = element(by.css('p-datatable tbody > tr:first-child > td:first-child sd-edit'));
        // initiate edit mode
        await editor.element(by.css('div.row')).click();
        // send the name to change to which should fire proper change events
        // clear the field before entering information
        await editor.element(by.css('input')).clear();

        await editor.element(by.css('input')).sendKeys(name);
        // click save;
        return editor.element(by.className('btn-primary')).click();
    }

    async editDataEntityColumnDefinition(rowIndex: number, definition: string): Promise<any> {
        // switch to columns tab if not there
        await this.columnsTab.click();

        const editor = element(by.css('p-datatable tbody > tr:first-child > td:nth-child(2) sd-edit'));
        // initiate edit mode
        await editor.element(by.css('div.row')).click();

        await browser.wait(protractor.ExpectedConditions.presenceOf(editor.element(by.css('div.cke_wysiwyg_div p'))));

        const editElement = editor.element(by.css('div.cke_wysiwyg_div p'));

        // send the definition to change to which should fire proper change events
        await editElement.click();

        // clear the field then enter information
        if (process.env.CURRENT_BROWSER === 'safari') {
            // requires command key since on mac
            // replacement needs to be send due to the paragraph needing to stay visible for tests
            // normally the component itself would add it back but the events for it to add it
            // don't fire.
            await this.clearContentsShim(editElement, '&nbsp;');
            await editElement.sendKeys(definition);
        } else if (process.env.CURRENT_BROWSER === 'firefox') {
            // requires that it be sent directly to the element because sendToActiveElement is not currently supported
            await editElement.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
            await editElement.sendKeys(protractor.Key.DELETE);
            await editElement.sendKeys(definition);
        } else {
            // requies to be sent generically as edge / chrome give an 'element isn't focusable' error
            // when sending keys to the paragraph element
            await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a')).perform();
            await browser.actions().sendKeys(protractor.Key.DELETE).perform();
            await browser.actions().sendKeys(definition).perform();
        }
        // click save
        return editor.element(by.className('btn-primary')).click();
    }


    async getRowData(rowIndex: number): Promise<DataEntityColumnRowData> {
        this.columnsTab.click()

        const rows = element.all(by.css('p-datatable tbody > tr'));

        const nameEditor = await rows.get(rowIndex).element(by.cssContainingText('td > span.ui-column-title', 'Business Name'))
            .element(by.xpath('following-sibling::span')).element(by.tagName('sd-edit'));
        const nameDisplay = await rows.get(rowIndex).element(by.cssContainingText('td > span.ui-column-title', 'Business Name'))
            .element(by.xpath('following-sibling::span')).element(by.className('no-auth-name'));

        let businessName: string = ((await this.isDisplayedShim(nameEditor)) === true
            && await nameEditor.element(by.css('div.row > div.col')).getText()) ||
            await nameDisplay.getText();

        const definitionEditor = await rows.get(rowIndex).element(by.cssContainingText('td > span.ui-column-title', 'Definition'))
            .element(by.xpath('following-sibling::span')).element(by.tagName('sd-edit'));
        const definitionDisplay = await rows.get(rowIndex).element(by.cssContainingText('td > span.ui-column-title', 'Definition'))
            .element(by.xpath('following-sibling::span')).element(by.className('no-auth-description'));

        let definition = '';

        if ( (await definitionEditor.isPresent()) === true ) {
            definition = ((await this.isDisplayedShim(definitionEditor)) === true &&
                  await definitionEditor.getText()) ||
                  await definitionDisplay.getText();
        }

        businessName = businessName.trim();
        definition = definition.trim();

        return Promise.resolve({
            businessName,
            definition,
            physicalName: (await rows.get(rowIndex).element(by.cssContainingText('td > span.ui-column-title', 'Physical Name'))
                .element(by.xpath('following-sibling::span')).getText()).trim(),
            dataType: (await rows.get(rowIndex).element(by.cssContainingText('td > span.ui-column-title', 'Data Type'))
                .element(by.xpath('following-sibling::span')).getText()).trim()
        })
    }
}

export interface DataEntityColumnRowData {
    businessName: string;
    definition: string;
    physicalName: string;
    dataType: string;
}
