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
import { by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';
import { BasePo } from '../../base/base.po';

export class OverviewPage extends BasePo {

  _headingEl = element(by.className('detail-header'));
  get heading () {
    return this._headingEl.getText();
  }
  _bdefTitleEl = element(by.className('detail-title'));
  auditDetails: ElementFinder = element(by.className('audit-details'));
  descLabel: ElementFinder = element(by.className('description-label'));
  _descEl: ElementFinder = element(by.css('#overview-panel .tab-contents > .col-9'));
  innerHeader: ElementArrayFinder = element.all(by.className('inner-header'));
  _bdefDetails = element(by.className('bdef-details'));
  formatHeader: ElementFinder = element.all(by.className('format-header')).get(0);
  formatContainer: ElementFinder = element(by.className('bdef-formats'));

  dataObjectListLinkContainer = element(by.className('data-object-link'));

  protected _tabs = element(by.tagName('ngb-tabset')).element(by.tagName('ul'));

  _tagsContainerEl: ElementFinder = element(by.className('tags-container'));
  _tagsEditorEl: ElementFinder = this._tagsContainerEl.element(by.className('tags-content'));
  tags: ElementArrayFinder = this._tagsContainerEl.all(by.tagName('button'));
  overviewTab: ElementFinder = this._tabs.all(by.tagName('li')).get(0).element(by.tagName('a'));

  dataProvider: ElementFinder = this._bdefDetails.all(by.tagName('div')).get(0).all(by.tagName('div')).get(1);
  physicalName: ElementFinder = this._bdefDetails.all(by.tagName('sd-ellipsis-overflow')).get(0);

  namespace: ElementFinder = this._bdefDetails.all(by.tagName('sd-ellipsis-overflow')).get(1);
  formatData: ElementArrayFinder = this.formatContainer.all(by.tagName('span'));
  formatUsage: ElementArrayFinder = this.formatContainer.all(by.tagName('sd-ellipsis-overflow'));
  RFToolTip: ElementFinder = this.formatContainer.element(by.tagName('i'));
  _noTagsMessageEl = this._tagsContainerEl.all(by.tagName('p')).get(1);
  get noTagsMessage() {
    return this._noTagsMessageEl.getText();
  }
  tagsEditIcon: ElementFinder = this._tagsContainerEl.element(by.className('col-1 edit-icon'));

  selectTag: ElementFinder = this._tagsContainerEl.element(by.tagName('ng-select'));
  selectOption: ElementFinder = this.selectTag.element(by.className('option'));
  deSelectOption: ElementFinder = this.selectOption.element(by.className('deselect-option'));
  doneButton: ElementFinder = this._tagsContainerEl.element(by.className('btn btn-primary'));
  dropDownItems: ElementArrayFinder = this._tagsContainerEl.element(by.tagName('select-dropdown')).all(by.tagName('li'));
  noTagFoundMessage: ElementFinder = this._tagsContainerEl.element(by.tagName('select-dropdown')).all(by.className('message')).get(0);
  typeAheadDropDown: ElementFinder = this._tagsContainerEl.element(by.tagName('input'));
  totalEditorTags: ElementArrayFinder = this._tagsEditorEl.all(by.className('list-inline-item'));
  _noFormatsMessageEl = this.formatContainer.all(by.tagName('p')).get(1);
  get noFormatsMessage() {
    return this._noFormatsMessageEl.getText();
  }
  lineageButton: ElementFinder = element(by.cssContainingText('sd-side-action .side-action', 'Lineage'));

  modal: ElementFinder = element(by.tagName('ngb-modal-window'));


  async getDescription () {
    const descEditor = this._descEl.element(by.tagName('sd-edit'));
    const descDisplay = this._descEl.element(by.className('description-body'));
    const description: string = ((await this.isDisplayedShim(descEditor)) === true
    && await descEditor.element(by.css('div.row > div.col')).getText()) ||
    await descEditor.getText();

    return description.trim();
  }
  async getBdefTitle() {
    const nameEditor = this._bdefTitleEl.element(by.tagName('sd-edit'));
    const nameDisplay = this._bdefTitleEl.element(by.css('div[sdauthorized] > div'));
    const name: string = ((await this.isDisplayedShim(nameEditor)) === true
    && await nameEditor.element(by.css('div.row > div.col')).getText()) ||
    await nameDisplay.getText();

    return name.trim();
  }

  closeModal(): promise.Promise<void> {
    return this.modal.element(by.className('close')).click();
  }

  async toggleRecommendedFormat(usage: string, fileType: string, version: string, hasAccess: boolean = true) {
    const formatFrame = await this.findFormatFrame(usage, fileType, version, hasAccess);
    if (formatFrame) {
      return formatFrame.click();
    } else {
      return Promise.resolve(null);
    }
  }

  async isDescriptiveFormat(usage: string, fileType: string, version: string, hasAccess: boolean = true) {
    const formatFrame = await this.findFormatFrame(usage, fileType, version, hasAccess);

    return (await formatFrame.getAttribute('class')).includes('recommended');
  }

  async getFormatTooltipText(usage: string, fileType: string, version: string, hasAccess: boolean = true): Promise<string> {
    const formatFrame = await this.findFormatFrame(usage, fileType, version);
    await this.mouseEnterShim(formatFrame);
    return (await this.getTooltipText(formatFrame.element(by.xpath('ancestor::div[1]')))).trim();
  }

  async findFormatFrame(usage: string, fileType: string, version: string, hasAccess: boolean = true): Promise<ElementFinder | null> {
    if (hasAccess) {
      const usages = element.all(
        by.cssContainingText('.format-whiteframe > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)', usage)
      );

      const fileTypes = usages.all(by.xpath('following-sibling::span')).filter((element) => {
        return element.getText().then((text) => {
          return text.includes(fileType);
        });
      });

      const versionField = await fileTypes.all(by.xpath('following-sibling::span')).filter((element) => {
        return element.getText().then((text) => {
          return text.includes(version);
        });
      })
      if (versionField.length === 1) {
        return versionField[0].element(by.xpath('ancestor::div[3]'));
      } else {
        return null;
      }
    } else {
      return this.formatContainer.all(by.css('div:nth-child(1)')).get(0);
    }
  }


  async getNoAuthFormatsFrameData(usage: string, filetype: string) {
    // note that version is not needed for this one
    const frame = await this.findFormatFrame(usage, filetype, '0', false);
    return {
      headerText: (await frame.element(by.className('inner-header')).getText()).trim(),
      UsageFormatProperty: (await frame.all(by.className('descriptive-format-property')).get(0).getText()).trim(),
      usageData: (await frame.all(by.css('.col-6 > sd-ellipsis-overflow')).get(0).getText()).trim(),
      fileTypeFormatProperty: (await frame.all(by.className('descriptive-format-property')).get(1).getText()).trim(),
      fileTypeData: (await frame.all(by.css('.col-6 > sd-ellipsis-overflow')).get(1).getText()).trim()
    }
  }

  async canEditDisplayName() {
    const editDisplayNameElement = this._bdefTitleEl.element(by.css('div:nth-child(2)'))
    // some browsers properly see this is not there others grab all (including non displaying but present) elements
    // if it grabs it make sure that it isn't currently shown.
    return this.isDisplayedShim(editDisplayNameElement);
  }

  async canEditCategories() {
    return this.isDisplayedShim(this._tagsEditorEl);
  }

  async editDisplayName(newDisplayName: string): Promise<void> {
    const editor = this._bdefTitleEl.element(by.css('sd-edit'));
    // initiate edit mode
    await editor.element(by.css('div.row')).click();
    // send the name to change to which should fire proper change events
    // clear the field before entering information
    await editor.element(by.css('input')).clear();

    await editor.element(by.css('input')).sendKeys(newDisplayName);
    // click save;
    return editor.element(by.className('btn-primary')).click();
  }
}

export interface NoAuthFrameData {
  headerText: string,
  UsageFormatProperty: string,
  usageData: string,
  fileTypeFormatProperty: string,
  fileTypeData: string
}
