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
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  BusinessObjectDataService, BusinessObjectDataSearchRequest, BusinessObjectData,
  BusinessObjectDataKey, BusinessObjectDataDdlRequest, Attribute, BusinessObjectFormatService, BusinessObjectFormat,
  BusinessObjectDefinition
} from '@herd/angular-client';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http'
import { default as AppIcons } from '../../../shared/utils/app-icons';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Action } from 'app/shared/components/side-action/side-action.component';
import { DataTable } from 'primeng/components/datatable/datatable';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  DataObjectListFiltersChangeEventData, LatestValidVersionFilter
} from 'app/data-objects/components/data-object-list-filters/data-object-list-filters.component';
import { AlertService, DangerAlert, SuccessAlert } from 'app/core/services/alert.service';
import { PartitionFilter } from '../../../../../e2e/app/data-objects/list/data-objects-list.po';
import { PartitionValueFilter } from '@herd/angular-client';
import { isNullOrUndefined } from 'util';
import { isDefined } from '@ng-bootstrap/ng-bootstrap/util/util';

class AttributeField implements Attribute {
  constructor(public name: string, public value: string) {
  }

  toString() {
    return `{name: ${this.name}, value: ${this.value}}  `;
  }
}

class PartitionField {
  constructor(public value: string, public key?: string) {
  }

  toString() {
    return this.key ? `${this.key} : ${this.value}` : this.value;
  }
}

class FormatField {
  constructor(public usage: string, public fileType: string, public version: number) {
  }

  toString() {
    return `${this.usage} : ${this.fileType} : ${this.version}`
  }
}

class DataObjectRowData {
  private _partition: PartitionField;
  private _attributes: AttributeField[];
  private _format: FormatField;

  version: number;
  dataEntity: BusinessObjectDefinition;
  subPartitions: string[];
  status: string;

  set partition(p: { value: string, key?: string }) {
    this._partition = new PartitionField(p.value, p.key);
  }

  get partition() {
    return this._partition;
  }

  set attributes(ats: Attribute[]) {
    this._attributes = ats.map((at) => {
      return new AttributeField(at.name, at.value);
    });
  }

  get attributes() {
    return this._attributes;
  }

  set format(f: { usage: string, fileType: string, version: number }) {
    this._format = new FormatField(f.usage, f.fileType, f.version);
  }

  get format() {
    return this._format;
  }

  get formatField(): string {
    return ''
  }
}


@Component({
  selector: 'sd-data-object-list',
  templateUrl: './data-object-list.component.html',
  styleUrls: ['./data-object-list.component.scss']
})
export class DataObjectListComponent implements OnInit {
  @ViewChild(DataTable) private dt: DataTable;
  config = { lineNumbers: true, mode: 'text/x-go', readOnly: true };
  dataEntity: BusinessObjectDefinition;
  format: BusinessObjectFormat;
  ddl = '';
  partitionValueFilters: Array<PartitionValueFilter>;
  useLatestValidVersion = false;
  ddlError: DangerAlert;
  sideActions: Action[] = [];
  loading = false;
  loadingDDL = false;
  lastLoad: Subscription;
  data: DataObjectRowData[] = [];
  cols = [{
    templateField: 'partition',
    field: 'partition',
    header: 'Partition',
    hide: false,
    sortable: true
  }, {
    templateField: 'version',
    field: 'version',
    header: 'Version',
    hide: false,
    sortable: true
  }, {
    templateField: 'subPartitions',
    field: 'subPartitions',
    header: 'Sub Partitions',
    hide: false,
    sortable: true
  }, {
    templateField: 'format',
    field: 'format',
    header: 'Format',
    hide: false,
    sortable: true
  }, {
    templateField: 'link',
    field: '',
    header: '',
    hide: false,
    sortable: false
  }]
  attributesCol = {
    templateField: 'attributes',
    field: 'attributes',
    header: 'Attributes',
    hide: false,
    sortable: false
  };
  statusCol = {
    templateField: 'status',
    field: 'status',
    header: 'Status',
    hide: false,
    sortable: true
  };

  constructor(private route: ActivatedRoute,
    private bDataApi: BusinessObjectDataService,
    private alerter: AlertService,
    private modalService: NgbModal,
    private formatService: BusinessObjectFormatService,
    private alertService: AlertService) {
  }

  getDDL() {
    const businessObjectDataDdlRequest: BusinessObjectDataDdlRequest = {
      namespace: this.dataEntity.namespace,
      businessObjectDefinitionName: this.dataEntity.businessObjectDefinitionName,
      businessObjectFormatUsage: this.format.businessObjectFormatUsage,
      businessObjectFormatFileType: this.format.businessObjectFormatFileType,
      outputFormat: BusinessObjectDataDdlRequest.OutputFormatEnum.DDL,
      tableName: this.dataEntity.businessObjectDefinitionName,
      partitionValueFilters: this.partitionValueFilters,
      allowMissingData: true
    };
    this.loadingDDL = true;
    this.bDataApi.defaultHeaders.append('skipAlert', 'true');
    return this.bDataApi.businessObjectDataGenerateBusinessObjectDataDdl(businessObjectDataDdlRequest)
      .finally(() => {
        this.bDataApi.defaultHeaders.delete('skipAlert');
        this.loadingDDL = false;
      });
  }

  open(content: TemplateRef<any> | String, windowClass?: string) {
    // append the modal to the data-entity-detail container so when views are switched it goes away with taht view.
    const modalReference = this.modalService.open(content, { windowClass: windowClass, size: 'lg', container: '.data-object-list' });
    this.getDDL().subscribe((response) => {
      this.ddl = response.ddl;
    }, (error) => {
      this.alertService.alert(new DangerAlert('HTTP Error: ' + error.status + ' ' + error.statusText,
        'URL: ' + error.url, 'Info: ' + error.json().message));
      modalReference.close();
    });
    return modalReference;
  }

  alertSuccessfulCopy() {
    this.alertService.alert(new SuccessAlert(
      'Success!', '', 'DDL Successfully copied to clipboard'
    ))
  }

  isInvalidDDLRequest() {
    const errors: String[] = [];
    if (!this.format) {
      errors.push('Please navigate from the Format Page.');
    } else {
      if (this.partitionValueFilters.length !== 1 || this.partitionValueFilters[0].partitionKey !== this.format.partitionKey) {
        errors.push('Please apply a Partition filter for the primary partition only.');
      }
      if (this.useLatestValidVersion === false) {
        errors.push('Please apply Latest Valid Version filter');
      }
    }
    return errors.length === 0 ? null : errors;
  }

  ngOnInit() {
    // only snapshot params are required currently.
    // if we change the routeResuseStrategy to change on routeConfig instead of
    // config and params then params will need to be listened to instead
    const params = this.route.snapshot.params;

    this.dataEntity = {
      businessObjectDefinitionName: params.dataEntityName,
      namespace: params.namespace
    }

    if (params.formatUsage && params.formatFileType && !isNaN(params.formatVersion)) {
      this.formatService.businessObjectFormatGetBusinessObjectFormat(
        this.dataEntity.namespace,
        this.dataEntity.businessObjectDefinitionName,
        params.formatUsage,
        params.formatFileType,
        params.formatVersion
      ).subscribe((response) => {
        this.format = response;
        this.loadData();
      });
    } else {
      this.loadData();
    }



    this.sideActions = [
      new Action(AppIcons.shareIcon, 'Share'),
      new Action(AppIcons.saveIcon, 'Save'),
      new Action(AppIcons.watchIcon, 'Watch')
    ]
  }

  export(e: DataTable) {
    e.exportCSV();
  }

  loadData(event?: DataObjectListFiltersChangeEventData) {
    this.partitionValueFilters = [];
    this.useLatestValidVersion = false;

    if (event) {
      if (event.latestValidVersion) {
        this.useLatestValidVersion = event.latestValidVersion;
      }
      if (event.partitionValueFilters) {
        this.partitionValueFilters = event.partitionValueFilters;
      }
    }

    if (this.lastLoad && !this.lastLoad.closed) {
      this.lastLoad.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.lastLoad = this.doDataSearch(event).catch((e: Response) => {
        if (e.status === 400) {
          this.dt.emptyMessage = e.json().message;
          return Observable.of(([] as DataObjectRowData[]));
        } else if (e.url) {
          this.alerter.alert(new DangerAlert('HTTP Error: ' + e.status + ' ' + e.statusText,
            'URL: ' + e.url, 'Info: ' + e.json().message));
          return Observable.of(([] as DataObjectRowData[]));
        }
      }).finally(() => {
        this.loading = false;
      }).subscribe((bData) => {
        this.data = bData;
      });
    } else {
      this.lastLoad = this.doDataGet().finally(() => {
        this.loading = false;
      }).subscribe((r) => {
        this.data = r;
      });
    }

  }

  private doDataGet(): Observable<DataObjectRowData[]> {
    // you will never get back attribute or status data with a bDataGetAll
    if (this.cols.indexOf(this.attributesCol) > -1) {
      this.cols.splice(this.cols.indexOf(this.attributesCol), 1);
    }

    if (this.cols.indexOf(this.statusCol) > -1) {
      this.cols.splice(this.cols.indexOf(this.statusCol), 1);
    }

    if (this.format) {
      return this.bDataApi.businessObjectDataGetAllBusinessObjectDataByBusinessObjectFormat(
        this.dataEntity.namespace,
        this.dataEntity.businessObjectDefinitionName,
        this.format.businessObjectFormatUsage,
        this.format.businessObjectFormatFileType,
        this.format.businessObjectFormatVersion
      ).map((r) => r.businessObjectDataKeys.length && this.convertToRowData(r.businessObjectDataKeys)) || null;
    } else {
      return this.bDataApi.businessObjectDataGetAllBusinessObjectDataByBusinessObjectDefinition(
        this.dataEntity.namespace,
        this.dataEntity.businessObjectDefinitionName
      ).map((r) => r.businessObjectDataKeys.length && this.convertToRowData(r.businessObjectDataKeys)) || null;
    }
  }

  private doDataSearch(filterInfo: DataObjectListFiltersChangeEventData): Observable<DataObjectRowData[]> {
    const searchRequest: BusinessObjectDataSearchRequest = {
      businessObjectDataSearchFilters: [
        {
          businessObjectDataSearchKeys: [{
            namespace: this.dataEntity.namespace,
            businessObjectDefinitionName: this.dataEntity.businessObjectDefinitionName,
            businessObjectFormatUsage: this.format && this.format.businessObjectFormatUsage || undefined,
            businessObjectFormatFileType: this.format && this.format.businessObjectFormatFileType || undefined,
            businessObjectFormatVersion: this.format && this.format.businessObjectFormatVersion || undefined,
            partitionValueFilters: filterInfo.partitionValueFilters,
            attributeValueFilters: filterInfo.attributeValueFilters,
            filterOnLatestValidVersion: filterInfo.latestValidVersion
          }]
        }
      ]
    }
    this.bDataApi.defaultHeaders.append('skipAlert', 'true');
    return this.bDataApi.businessObjectDataSearchBusinessObjectData(searchRequest).pipe(
      tap((r) => {
        // make sure that the singleton clears its skip alert so that if any other component
        // uses the bDataApi singleton it has the choice of adding it or not
        this.bDataApi.defaultHeaders.delete('skipAlert');
        return r;
      }),
      map((r) => {

        const fieldsToShow: string[] = [];
        if (r.businessObjectDataElements.length) {
          if (r.businessObjectDataElements[0].attributes) {
            if (this.cols.indexOf(this.attributesCol) === -1) {
              this.cols.splice(2, 0, this.attributesCol);
            }
          }

          if (r.businessObjectDataElements[0].status) {
            if (this.cols.indexOf(this.statusCol) === -1) {
              this.cols.splice(2, 0, this.statusCol);
            }
          }
        }
        return r.businessObjectDataElements.length && this.convertToRowData(r.businessObjectDataElements) || null
      }));
  }

  private convertToRowData(data: (BusinessObjectDataKey | BusinessObjectData)[]): DataObjectRowData[] {
    const retval: DataObjectRowData[] = data.map((keyOrData: BusinessObjectData) => {
      const row = new DataObjectRowData();
      row.dataEntity = {
        businessObjectDefinitionName: keyOrData.businessObjectDefinitionName,
        namespace: keyOrData.namespace
      };
      row.format = {
        usage: keyOrData.businessObjectFormatUsage,
        fileType: keyOrData.businessObjectFormatFileType,
        version: keyOrData.businessObjectFormatVersion
      }
      row.partition = {
        key: keyOrData.partitionKey,
        value: keyOrData.partitionValue
      }
      row.subPartitions = keyOrData.subPartitionValues || [];
      row.version = keyOrData.version === null || keyOrData.version === undefined ?
        (<BusinessObjectDataKey>keyOrData).businessObjectDataVersion : keyOrData.version
      row.attributes = keyOrData.attributes || [];
      row.status = keyOrData.status;

      return row;
    });
    return retval
  }

}
