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
import { by, element, ElementFinder } from 'protractor';
import { BasePo } from '../base/base.po';

export class FormatPage extends BasePo {

  private _container = element(by.className('format-detail'));
  public pageTitle = this._container.element(by.className('detail-header'));
  public heading = this._container.element(by.className('detail-title'));
  public dataObjectLink = this._container.element(by.className('data-object-link'));
  public subHeading = this._container.element(by.className('physical-name'));
  public dataEntityLink = this.subHeading.element(by.tagName('a'));
  public physicalNameText = this.subHeading.element(by.tagName('span'));

  // tabs
  public _tabs = element.all(by.tagName('ngb-tabset'));
  public documentSchemaTab = this._tabs.get(0).all(by.tagName('a')).get(2);
  public columnsTab = this._tabs.get(0).all(by.tagName('a')).get(1);
  public overviewTab = this._tabs.get(0).all(by.tagName('a')).get(0);

  public attrDefinitionTab = this._tabs.get(1).all(by.tagName('a')).get(0);
  public userDefinedAttrTab = this._tabs.get(1).all(by.tagName('a')).get(1);

  // Overview tab
  public overviewContainer = this._container.element(by.className('overview'));
  public overviewSubHeaderLabels = this.overviewContainer.all(by.className('sub-header-label'));
  public descBody = this.overviewContainer.element(by.className('description-body'));

  // format version dropdown
  public versionDropDown = this.overviewContainer.element(by.tagName('select'));
  public getAllVersions = this.versionDropDown.all(by.tagName('option'));

    // Partitions sub header
  public partitionsUnavailable = this.overviewContainer.element(by.tagName('p'));

  // Attributes Definitions sub header
  private attrDefnContainer = this.overviewContainer.element(by.tagName('sd-attribute-definitions'));
  public attrDefnUnavailable = this.attrDefnContainer.element(by.className('unavailable-label'));
  public attrDefnColsHeader = this.attrDefnContainer.element(by.className('columns-header'));
  public attrDefnColsContent = this.attrDefnContainer.element(by.className('columns-detail'));


  // User Defined attributes sub header
  private userAttrContainer = this.overviewContainer.element(by.tagName('sd-attributes'));
  public userDefnUnavailable = this.userAttrContainer.element(by.className('unavailable-label'));
  public userDefnColsHeader = this.userAttrContainer.element(by.className('columns-header'));
  public userDefnColsContent = this.userAttrContainer.element(by.className('columns-detail'));


  // schema columns
  private schemaColumnsContainer = element(by.className('schema-columns'));
  public schemaColumnsHeader = this.schemaColumnsContainer.element(by.className('ui-datatable-thead'));
  public schemaColumnsEmptyMessage = this.schemaColumnsContainer.element(by.className('ui-datatable-emptymessage'));

  // schema columns
  public documentSchemaContainer = element(by.className('document-schema'));


  get schemaColData1(): ElementFinder {
         return this.schemaColumnsContainer.all(by.className('ui-datatable-even')).get(0);
  }

  get schemaColData2(): ElementFinder {
       return this.schemaColumnsContainer.all(by.className('ui-datatable-odd')).get(0);
  }

   // partition columns
  private partitionColumnsContainer = element(by.className('partition-data'));
  public partitionColumnsHeader = this.partitionColumnsContainer.element(by.className('columns-header'));
  public partitionColumnsData = this.partitionColumnsContainer.all(by.className('columns-detail'));

  // details sub header
  getDetailsGroup(index: number) {
    return this.overviewContainer.all(by.css('.details-sub > div')).get(index);
  }




}
