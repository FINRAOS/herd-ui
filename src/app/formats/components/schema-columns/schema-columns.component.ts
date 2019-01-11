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
import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AlertService, DangerAlert, SuccessAlert } from '../../../core/services/alert.service';
import { BusinessObjectFormatDdlRequest, BusinessObjectFormatService } from '@herd/angular-client';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'sd-schema-columns',
  templateUrl: './schema-columns.component.html',
  styleUrls: ['./schema-columns.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchemaColumnsComponent implements OnInit {
  // TODO: remove this component as it is not needed anymore. do not use this compponent
  @Input() content: any;
  @Input() bdef: any;
  schemaCols = [
    {
      templateField: 'name',
      field: 'name',
      header: 'Name',
      hide: false,
      sortable: true,
      style: {'width': '80px'}
    }, {
      templateField: 'type',
      field: 'type',
      header: 'Type',
      hide: false,
      sortable: true,
      style: {'width': '80px'}
    }, {
      templateField: 'size',
      field: 'size',
      header: 'Size',
      hide: false,
      sortable: true,
      style: {'width': '40px'}
    }, {
      templateField: 'required',
      field: 'required',
      header: 'Required?',
      hide: false,
      sortable: true,
      style: {'width': '60px'}
    }, {
      templateField: 'defaultValue',
      field: 'defaultValue',
      header: 'Default Value',
      hide: false,
      sortable: true,
      style: {'width': '85px'}
    }, {
      templateField: 'bDefColumnDescription',
      field: 'bDefColumnDescription',
      header: 'Description',
      hide: false,
      sortable: true,
      style: {'width': '300px'}
    }
  ];

  ddl = '';
  ddlError: DangerAlert;
  config = {lineNumbers: true, mode: 'text/x-go', readOnly: true};
  modalReference: NgbModalRef;

  constructor(
    private alertService: AlertService,
    private modalService: NgbModal,
    private businessObjectFormatService: BusinessObjectFormatService
  ) {
  }

  ngOnInit() {
    if (this.bdef && this.bdef.namespace) {
      this.getDDL(this.bdef);
    }
  }

  alertSuccessfulCopy() {
    this.alertService.alert(new SuccessAlert(
      'Success!', '', 'DDL Successfully copied to clipboard'
    ));
  }

  getDDL(bdef) {
    const businessObjectFormatDdlRequest: BusinessObjectFormatDdlRequest = {
      namespace: bdef.namespace,
      businessObjectDefinitionName: bdef.businessObjectDefinitionName,
      businessObjectFormatUsage: bdef.businessObjectFormatUsage,
      businessObjectFormatFileType: bdef.businessObjectFormatFileType,
      businessObjectFormatVersion: bdef.businessObjectFormatVersion,
      outputFormat: BusinessObjectFormatDdlRequest.OutputFormatEnum.HIVE13DDL,
      tableName: bdef.businessObjectDefinitionName
    };
    this.businessObjectFormatService.defaultHeaders.append('skipAlert', 'true');

    this.businessObjectFormatService.businessObjectFormatGenerateBusinessObjectFormatDdl(businessObjectFormatDdlRequest)
      .pipe(finalize(() => {
          this.businessObjectFormatService.defaultHeaders.delete('skipAlert');
      }))
      .subscribe((response: any) => {
        this.ddl = response.ddl;
      }, (error) => {
        this.ddlError = new DangerAlert('HTTP Error: ' + error.status + ' ' + error.statusText,
          'URL: ' + error.url, 'Info: ' + error.error.message);
      });
  }

  open(content: TemplateRef<any> | String, windowClass?: string) {
    // append the modal to the data-entity-detail container so when views are switched it goes away with taht view.
    this.modalReference = this.modalService.open(content, {windowClass: windowClass, size: 'lg', container: '.schema-columns'});
    return this.modalReference;
  }

  close() {
    this.modalReference.close();
  }

}

