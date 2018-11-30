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
import { by, element } from 'protractor';
import { BasePo } from '../../base/base.po';

export class DataObjectDetailPage extends BasePo {

  // element to reach to the detail page from list page
  public dataListFirstLink = element.all(by.linkText('View Data Object')).get(0);


  public screenTitle = element(by.css('.header-content .detail-header'));
  public keyValueTitle = element(by.css('.detail-title'));
  public schemaInfoTitle = element(by.css('.sub-header'));

  // partition selectors
  public partitionInfoContainer = element(by.css('.partition-details-container'));
  public partitionInfoHeaderLabel = this.partitionInfoContainer.element(by.className('sub-header-label'));
  public keyLabel = this.partitionInfoContainer.element(by.className('details-label'));
  public valueLabel = this.partitionInfoContainer.element(by.className('details-label'));

  public partitions = this.partitionInfoContainer.all(by.css('.partition-value'));
  public partitionValueContainer = this.partitionInfoContainer.all(by.css('.partition-value')).get(0);
  public subPartitionValueContainer = this.partitionInfoContainer.all(by.css('.partition-value')).get(1);
  public subPartitionValue = this.subPartitionValueContainer.all(by.css('.col-6'));

  public partitionKey = this.partitionValueContainer.all(by.className('col-6'));
  public subPartitionKeys = this.partitionValueContainer.all(by.className('col-6'));
  public partitionValue = this.subPartitionValueContainer.element(by.className('col-6'));
  public subPartitionValues = this.subPartitionValueContainer.all(by.className('col-6'));

  // detail selectors
  public detailsContainer = this.partitionInfoContainer.element(by.css('.offset-1'));
  public detailsHeaderLabel = by.className('sub-header-label');
  public detailsLabels = this.detailsContainer.element(by.className('details-label'));
  public status = this.detailsContainer.element(by.className('status'));
  public id = this.detailsContainer.element(by.className('id'));

  public attributesContainer = element.all(by.className('content-wrapper')).get(0);
  public attributesEmptyMessageLabel = this.attributesContainer.element(by.className('unavailable-label'));
  public userDefAttributesTableRows = element.all(by.css('.columns-detail > .list-group-item'));

  // child
  public childLineageSection = element.all(by.className('content-wrapper')).get(1);
  public childLineageHeaderLabel = this.childLineageSection.element(by.className('header-label'));
  public childLineageSectionColumns = this.childLineageSection.element(by.className('sub-toolbar'));
  public childLineageRepeater = this.childLineageSection.all(by.repeater('bData in content'));
  public noChildrenLabel = this.childLineageSection.element(by.className('unavailable-label'));

  // parent
  public parentLineageSection = element.all(by.className('content-wrapper')).get(2);
  public parentLineageHeaderLabel = this.parentLineageSection.element(by.className('header-label'));
  public parentLineageSectionColumns = this.parentLineageSection.element(by.className('sub-toolbar'));
  public parentLineageRepeater = this.parentLineageSection.all(by.repeater('bData in content'));
  public noParentsLabel = this.parentLineageSection.element(by.className('unavailable-label'));

  // status history and files
  public statusHistorySection = element.all(by.className('content-wrapper')).get(3);
  public statusHistorySectionLabel = this.statusHistorySection.element(by.className('header-label'));
  public statusHistorySectionColumns = this.statusHistorySection.element(by.className('sub-toolbar'));

  // TODO needs to be updated to new tests...
  public statusHistoryRepeater = this.statusHistorySection.all(
    by.repeater('businessObjectDataStatusChangeEvent in vm.businessObjectData.businessObjectDataStatusHistory')
  );

  public storageUnitsSection = element(by.tagName('sd-storage-units'));
  public storageUnitsSectionLabel = this.storageUnitsSection.element(by.className('sub-header-label'));
  public storageUnitsRepeater = this.storageUnitsSection.all(by.className('storage-loop'));


  public getLineageRowData(lineageRepeater, index) {
    const row = lineageRepeater.get(index);
    const cell = row.all(by.tagName('elipsis-overflow'));
    return {
      namespace: cell.get(0),
      bDefName: cell.get(1),
      schema: cell.get(2),
      partitionValue: cell.get(3),
      subPartitions: cell.get(4),
      dataVersion: cell.get(5),
      link: row.element(by.tagName('a'))
    };
  }

  public getSingleStorageUnit(index) {
    const storageUnit = this.storageUnitsRepeater.get(index);

    return {
      emptyFilesLabel: storageUnit.element(by.className('text-left')),
      columnsLabel: storageUnit.all(by.className('list-group-item')).get(0),
      storageName: storageUnit.all(by.className('list-group-item')).get(1)
        .all(by.tagName('div')).get(0).getText(),
      storageStatus: storageUnit.all(by.className('list-group-item')).get(1)
        .all(by.tagName('div')).get(1).getText(),
      bucketNameLabel: storageUnit.all(by.className('list-group-item')).get(1)
        .all(by.tagName('div')).get(2).element(by.css('div > div > div')),

      directoryPath: storageUnit.all(by.className('list-group-item')).get(1)
        .all(by.tagName('div')).get(2).element(by.css('.directory')).getText(),
      statusHistorySectionLabel: storageUnit.element(by.cssContainingText('left-blue-border h2', 'Status History')),
      statusHistorySectionColumnsLabels: storageUnit
      .element(by.cssContainingText('left-blue-border h2', 'Status History'))
      .element(by.xpath('ancestor::div[1]')).element(by.xpath('following-sibling::div'))
      .element(by.css('.columns-header > .list-group-item')),
      statusHistorySectionColumnsData: storageUnit
      .element(by.cssContainingText('left-blue-border h2', 'Status History'))
      .element(by.xpath('ancestor::div[1]')).element(by.xpath('following-sibling::div'))
      .all(by.className('columns-detail')),
      filesSectionLabel: storageUnit.element(by.cssContainingText('left-blue-border h2', 'Files')),
      filesSectionColumnsLabel: storageUnit.all(by.className('list-group-item')).get(2),
      filesRepeater: storageUnit.all(by.css('.files-loop > .list-group-item')),
      getFileDownloadIcon: (findx) => {
        return storageUnit.all(by.css('.files-loop > .list-group-item')).get(findx).element('fa-cloud-download');
      },
      getSingleFile: (fIndex) => {
        const file = storageUnit.all(by.css('.files-loop > .list-group-item')).get(fIndex);
        return {
          filePath: file.all(by.tagName('div')).get(0).getText(),
          fileSize: file.all(by.tagName('div')).get(1).getText(),
          rowCount: file.all(by.tagName('div')).get(2).getText(),
          fileDownloadIcon: file.all(by.tagName('div')).get(3)
        };
      }
    };
  }

  public dataObjectPage(dataObjectrow = 0) {
    return element.all(by.linkText('View Data Object')).get(dataObjectrow);
  }


}
