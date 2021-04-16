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
import { RegistrationDateRangeFilter } from '@herd/angular-client';


export class AttributeFilter {
  applyButton: ElementFinder;
  cancelButton: ElementFinder;
  title: ElementFinder;
  clearButton: ElementFinder;
  nameInput: ElementFinder;
  valueInput: ElementFinder;
  closeButton: ElementFinder;

  constructor(public filter: ElementFinder) {
    this.title = filter.element(by.className('filter-title'));
    this.closeButton = this.title.element(by.className('close-col'));
    this.clearButton = filter.all(by.tagName('button')).get(0);
    this.applyButton = filter.all(by.tagName('button')).get(1);
    this.cancelButton = filter.all(by.tagName('button')).get(2);
    this.nameInput = filter.all(by.tagName('input')).get(0);
    this.valueInput = filter.all(by.tagName('input')).get(1);
  }
}

export class PartitionFilter {
  closeButton: ElementFinder;
  clearButton: ElementFinder;
  applyButton: ElementFinder;
  cancelButton: ElementFinder;
  minInput: ElementFinder;
  maxInput: ElementFinder;
  keyInput: ElementFinder;
  valueInput: ElementFinder;
  title: ElementFinder;

  constructor(public filter: ElementFinder) {
    this.title = filter.element(by.className('filter-title'));
    this.closeButton = this.title.element(by.className('close-col'));
    this.keyInput = filter.all(by.tagName('input')).get(0);
    this.valueInput = filter.all(by.tagName('input')).get(1);
    this.minInput = filter.all(by.tagName('input')).get(2);
    this.maxInput = filter.all(by.tagName('input')).get(3);
  }
}

export class RegistrationDateValidFilter {
  closeButton: ElementFinder;
  clearButton: ElementFinder;
  applyButton: ElementFinder;
  cancelButton: ElementFinder;
  startDateInput: ElementFinder;
  endDateInput: ElementFinder;
  title: ElementFinder;

  constructor(public filter: ElementFinder) {
    this.title = filter.element(by.className('filter-title'));
    this.closeButton = this.title.element(by.className('close-col'));
    this.startDateInput = filter.all(by.tagName('input')).get(0);
    this.endDateInput = filter.all(by.tagName('input')).get(1);
  }
}

export class LatestValidFilter {
  closeButton: ElementFinder;
  title: ElementFinder;

  constructor(public filter: ElementFinder) {
    this.title = filter.element(by.className('filter-title'));
    this.closeButton = this.title.element(by.className('close-col'));
  }
}

export class DataTable {
  rows: RowData[];

  constructor() {

  }
}

export class RowData {
  partition: ElementFinder;
  version: ElementFinder;
  subPartitions: ElementFinder;
  format: ElementFinder;
  link: ElementFinder;
  attributes: ElementFinder;
  status: ElementFinder;

  constructor(public row: ElementFinder) {
    this.status = this.row
      .element(by.cssContainingText('td > span.ui-column-title', 'Status'))
      .element(by.xpath('following-sibling::span'));
    this.partition = this.row
      .all(by.cssContainingText('td > span.ui-column-title', 'Partition')).first()
      .element(by.xpath('following-sibling::span'));
    this.version = this.row
      .element(by.cssContainingText('td > span.ui-column-title', 'Version'))
      .element(by.xpath('following-sibling::span'));
    this.format = this.row
      .element(by.cssContainingText('td > span.ui-column-title', 'Format'))
      .element(by.xpath('following-sibling::span'));
    this.subPartitions = this.row
      .element(by.cssContainingText('td > span.ui-column-title', 'Sub Partitions'))
      .element(by.xpath('following-sibling::span'));
    this.attributes = this.row
      .element(by.cssContainingText('td > span.ui-column-title', 'Attributes'))
      .element(by.xpath('following-sibling::span'));
    this.link = this.row
      .element(by.linkText('View Data Object'));
  }
}

export class DataObjectListPage extends BasePo {
  emptyMessage: ElementFinder = element(by.css('.ui-datatable-emptymessage'));
  mainHeader: ElementFinder = element(by.className('main-header'));
  subHeader: ElementFinder = element(by.className('sub-header'));

  dataEntitySubHeader: ElementFinder = this.subHeader.all(by.tagName('span')).first();
  dataEntitySubHeaderLink: ElementFinder = this.dataEntitySubHeader.element(by.tagName('a'));
  formatSubHeader: ElementFinder = this.subHeader.all(by.tagName('span')).get(1);
  formatSubHeaderLink: ElementFinder = this.formatSubHeader.element(by.tagName('a'));

  filtersSection: ElementFinder = element(by.className('data-object-list-filters'));

  addFilterButton: ElementFinder = this.filtersSection.element(by.className('dropdown-toggle'));
  addFilterMenu: ElementFinder = element(by.className('dropdown-menu'));
  addFilterMenuItems: ElementArrayFinder = this.addFilterMenu.all(by.className('dropdown-item'));

  filters: ElementArrayFinder = this.filtersSection.all(by.css('.filters > div'));

  dataTable: ElementFinder = element(by.tagName('p-datatable'));

  dataTableHeader: ElementFinder = this.dataTable.element(by.tagName('p-header'));

  dataRows: ElementArrayFinder = this.dataTable.all(by.css('tbody.ui-datatable-data > tr'));

  async createFilter(type: 'attr' | 'part' | 'lvv' | 'regiDateRng'):
    Promise<AttributeFilter | PartitionFilter | LatestValidFilter | RegistrationDateRangeFilter | null> {
    if (!await this.addFilterMenu.isDisplayed()) {
      await this.addFilterButton.click();
    }

    switch (type) {
      case 'attr':
        await this.addFilterMenuItems.get(1).click();
        break;
      case 'part':
        await this.addFilterMenuItems.get(0).click();
        break;
      case 'lvv':
        if (await this.addFilterMenuItems.count() > 2) {
          await this.addFilterMenuItems.get(2).click();
        } else {
          return null;
        }
        break;
      case 'regiDateRng':
        if (await this.addFilterMenuItems.count() > 2) {
          await this.addFilterMenuItems.get(2).click();
        } else {
          return null;
        }
        break;
    }

    return await this.selectFilter(await this.filters.count() - 1, type);
  }

  selectFilter(index: number, type: 'attr' | 'part' | 'lvv' | 'regiDateRng'):
    AttributeFilter | PartitionFilter | LatestValidFilter | RegistrationDateValidFilter {
    switch (type) {
      case 'attr':
        return new AttributeFilter(this.filters.get(index));
      case 'part':
        return new PartitionFilter(this.filters.get(index));
      case 'lvv':
        return new LatestValidFilter(this.filters.get(index));
      case 'regiDateRng':
        return new RegistrationDateValidFilter(this.filters.get(index));
    }

  }

  async getRow(index: number): Promise<RowData> {
    return await new RowData(this.dataRows.get(index));
  }
}


