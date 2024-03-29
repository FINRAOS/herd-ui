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
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { default as AppIcons } from '../../../shared/utils/app-icons';
import { Action } from '../../../shared/components/side-action/side-action.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BusinessObjectDataAvailabilityRequest,
  BusinessObjectDataService,
  BusinessObjectDefinitionColumnService,
  BusinessObjectFormatExternalInterfaceDescriptiveInformationService,
  BusinessObjectFormatService,
  StorageService
} from '@herd/angular-client';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AlertService, DangerAlert, WarningAlert } from 'app/core/services/alert.service';
import { finalize, flatMap, map, startWith } from 'rxjs/operators';
import { AuthMap } from '../../../shared/directive/authorized/authorized.directive';
import { environment } from '../../../../environments/environment';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { BeastService } from '../../../shared/services/beast.service';
import { BeastComponents } from '../../../shared/services/beast-components.enum';
import { BeastActions } from '../../../shared/services/beast-actions.enum';

function toPaddedHexString(num, len) {
  const str = num.toString(16).toUpperCase();
  return '0'.repeat(len - str.length) + str;
}

@Component({
  selector: 'sd-format-detail',
  templateUrl: './format-detail.component.html',
  styleUrls: ['./format-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormatDetailComponent implements OnInit {
  authMap = AuthMap;

  sideActions;

  namespace;
  businessObjectDefinitionName;
  businessObjectFormatUsage;
  businessObjectFormatFileType;
  businessObjectFormatVersion;
  businessObjectFormatDetail: any;
  unicodeSchemaNullValue = '';
  unicodeSchemaDelimiter = '';
  unicodeSchemaEscapeCharacter = '';
  businessObjectDefinitionColumns: any;
  minPrimaryPartitionValue: any;
  maxPrimaryPartitionValue: any;
  formatVersions: Observable<number[]>;
  externalInterfaceName = '';
  externalInterfaceDisplayName = '';
  externalInterfaceDescription = '';
  externalInterfaceError: DangerAlert;
  modalReference: NgbModalRef;
  documentSchemaConfig = {
    lineNumbers: true,
    lineWrapping: true,
    mode: 'text/x-go',
    readOnly: true,
    scrollbarStyle: null,
    fixedGutter: true
  };
  dataObjectListPermissionsResolution = environment.dataObjectListPermissionsResolution;
  private errorMessageNotFound = 'No data registered';
  private errorMessageAuthorization = 'Access Denied';
  editorOptions: JsonEditorOptions;
  documentSchemaJson: any;
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private modalService: NgbModal,
    private businessObjectFormatApi: BusinessObjectFormatService,
    private businessObjectDefinitionColumnApi: BusinessObjectDefinitionColumnService,
    private businessObjectDataApi: BusinessObjectDataService,
    private businessObjectFormatExternalInterfaceDescriptiveInformationApi:
      BusinessObjectFormatExternalInterfaceDescriptiveInformationService,
    private storageApi: StorageService,
    private alerter: AlertService,
    private bs: BeastService,
    private router: Router
  ) {
  }

  alertForEditingSchema(event = null) {
    this.alertService.alert(new WarningAlert('Editing document schema is not supported. Any changes made will be lost.',
      '', '', 8));
  }

  ngOnInit() {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'tree'];
    this.activatedRoute.params.subscribe((param) => {
      this.namespace = param['namespace'];
      this.businessObjectDefinitionName = param['dataEntityname'];
      this.businessObjectFormatUsage = param['formatUsage'];
      this.businessObjectFormatFileType = param['formatFileType'];
      this.businessObjectFormatVersion = parseInt(param['formatVersion'], 10);

      // used to fill in all of the versions for the select
      this.formatVersions = this.businessObjectFormatApi
        .businessObjectFormatGetBusinessObjectFormats(this.namespace, this.businessObjectDefinitionName, false)
        .pipe(
          map((resp) => {
            return resp.businessObjectFormatKeys.filter((key) => {
              return key.businessObjectFormatUsage === this.businessObjectFormatUsage
                && key.businessObjectFormatFileType === this.businessObjectFormatFileType;
            }).map((key) => {
              return key.businessObjectFormatVersion;
            }).sort((a, b) => {
              return a - b;
            });
          }),
          startWith([]) // use starts with to get rid of template parsing errors using async pipe
        );

      this.businessObjectFormatApi
        .businessObjectFormatGetBusinessObjectFormat(this.namespace,
          this.businessObjectDefinitionName,
          this.businessObjectFormatUsage,
          this.businessObjectFormatFileType,
          this.businessObjectFormatVersion)
        .subscribe((bFormatResponse) => {
          this.businessObjectFormatDetail = bFormatResponse;
          if (this.businessObjectFormatDetail && (this.businessObjectFormatDetail.documentSchema)) {
            try {
              this.documentSchemaJson = JSON.parse(this.businessObjectFormatDetail.documentSchema);
            } catch (e) {
              this.documentSchemaJson = this.businessObjectFormatDetail.documentSchema;
            }
          }
          if (this.businessObjectFormatDetail.schema) {
            if (this.businessObjectFormatDetail.schema.nullValue
                && this.businessObjectFormatDetail.schema.nullValue.length === 1) {
              this.unicodeSchemaNullValue = '(U+' + toPaddedHexString(this.businessObjectFormatDetail.schema.nullValue.charCodeAt(0), 4)
                + ')';
            }
            if (this.businessObjectFormatDetail.schema.delimiter
                && this.businessObjectFormatDetail.schema.delimiter.length === 1) {
              this.unicodeSchemaDelimiter = '(U+' + toPaddedHexString(this.businessObjectFormatDetail.schema.delimiter.charCodeAt(0), 4)
                + ')';
            }
            if (this.businessObjectFormatDetail.schema.escapeCharacter
                && this.businessObjectFormatDetail.schema.escapeCharacter.length === 1) {
              this.unicodeSchemaEscapeCharacter = '(U+'
                + toPaddedHexString(this.businessObjectFormatDetail.schema.escapeCharacter.charCodeAt(0), 4) + ')';
            }
          }
          this.businessObjectDefinitionColumnApi
            .businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns(this.namespace, this.businessObjectDefinitionName)
            .subscribe((response) => {
              this.businessObjectDefinitionColumns = response.businessObjectDefinitionColumnKeys;
              for (const businessObjectDefinitionColumn of this.businessObjectDefinitionColumns) {
                this.businessObjectDefinitionColumnApi
                  .businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn(
                    businessObjectDefinitionColumn.namespace,
                    businessObjectDefinitionColumn.businessObjectDefinitionName,
                    businessObjectDefinitionColumn.businessObjectDefinitionColumnName
                  ).subscribe((resp) => {
                  businessObjectDefinitionColumn.schemaColumnName = resp.schemaColumnName;
                  businessObjectDefinitionColumn.description = resp.description;
                  if (this.businessObjectFormatDetail.schema && this.businessObjectFormatDetail.schema.columns) {
                    for (const col of this.businessObjectFormatDetail.schema.columns) {
                      if (businessObjectDefinitionColumn.schemaColumnName === col.name) {
                        col.bDefColumnDescription = businessObjectDefinitionColumn.description;
                      }
                    }
                  }

                });
              }

            });
        });

      // setting the min and max partition value
      this.getMinAndMaxPartitionValues();
    });

    this.populateSideActions();
  }

  switchVersions(select) {
    const version = select.value;
    select.value = this.businessObjectFormatVersion; // revert to previous value for saved state.
    this.router.navigate(['/formats', this.namespace,
      this.businessObjectDefinitionName,
      this.businessObjectFormatUsage,
      this.businessObjectFormatFileType, version]);
  }

  sendViewDataObjectListActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewDataObejctList, BeastComponents.dataObjects, null, null);
  }

  sendViewDocumentSchemaActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewDocumentSchema, BeastComponents.dataObjects, null, null);
  }

  sendViewColumnsActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewColumns, BeastComponents.dataObjects, null, null);
  }

  getExternalInterface(externalInterfaceName: string) {
    this.businessObjectFormatExternalInterfaceDescriptiveInformationApi.defaultHeaders.append('skipAlert', 'true');
    this.businessObjectFormatExternalInterfaceDescriptiveInformationApi
      .businessObjectFormatExternalInterfaceDescriptiveInformationGetBusinessObjectFormatExternalInterface(
        this.namespace,
        this.businessObjectDefinitionName,
        this.businessObjectFormatUsage,
        this.businessObjectFormatFileType,
        externalInterfaceName)
      .pipe(finalize(() => {
        this.businessObjectFormatExternalInterfaceDescriptiveInformationApi.defaultHeaders.delete('skipAlert');
      }))
      .subscribe((response: any) => {
        this.externalInterfaceDisplayName = response.externalInterfaceDisplayName;
        this.externalInterfaceDescription = response.externalInterfaceDescription;
      }, (error) => {
        this.externalInterfaceError = new DangerAlert('HTTP Error: ' + error.status + ' ' + error.statusText,
          'URL: ' + error.url, 'Info: ' + error.error.message);
      });
  }

  open(content: TemplateRef<any> | String, externalInterfaceName: string, windowClass?: string) {
    this.externalInterfaceName = externalInterfaceName;
    this.externalInterfaceDisplayName = '';
    this.externalInterfaceDescription = 'Loading...';
    this.getExternalInterface(externalInterfaceName);
    // append the modal to the data-entity-detail container so when views are switched it goes away with that view.
    this.modalReference = this.modalService.open(content, {windowClass: windowClass, size: 'lg', container: '.format-detail'});
    return this.modalReference;
  }

  close() {
    this.modalReference.close();
  }

  private getMinAndMaxPartitionValues() {
    const request: BusinessObjectDataAvailabilityRequest = {
      namespace: this.namespace,
      businessObjectDefinitionName: this.businessObjectDefinitionName,
      businessObjectFormatUsage: this.businessObjectFormatUsage,
      businessObjectFormatFileType: this.businessObjectFormatFileType,
      businessObjectFormatVersion: this.businessObjectFormatVersion,
      partitionValueFilter: {
        partitionValues: [
          '${minimum.partition.value}',
          '${maximum.partition.value}'
        ]
      }
    };

    // to get the absolute possible maximum and minimum values
    // we hve to search accross all storage names for the request.
    // so first get all storage names and then make the request for each.

    this.businessObjectDataApi.defaultHeaders.append('skipAlert', 'true');
    this.storageApi.defaultHeaders.append('skipAlert', 'true');
    this.storageApi.storageGetStorages().pipe(
      flatMap((resp: any) => {
        request.storageNames = resp.storageKeys.map((key) => {
          return key.storageName;
        });
        return this.businessObjectDataApi
          .businessObjectDataCheckBusinessObjectDataAvailability(request);
      })).pipe(finalize(() => {
      this.businessObjectDataApi.defaultHeaders.delete('skipAlert');
      this.storageApi.defaultHeaders.delete('skipAlert');
    })).subscribe(
      (response) => {
        if (response.availableStatuses.length) {
          this.minPrimaryPartitionValue = response.availableStatuses[0].partitionValue;
          this.maxPrimaryPartitionValue = response.availableStatuses[1].partitionValue;
        }
      },
      (error) => {
        // Check for 400 error to change to polite error message
        if (error.status === 404 || error.status === 403) {
          if (error.status === 403) {
            this.minPrimaryPartitionValue = this.errorMessageAuthorization;
            this.maxPrimaryPartitionValue = this.errorMessageAuthorization;
          } else {
            this.minPrimaryPartitionValue = this.errorMessageNotFound;
            this.maxPrimaryPartitionValue = this.errorMessageNotFound;
          }
        } else if (error.url) {
          // be sure to show other errors if they occur.
          this.alerter.alert(new DangerAlert('HTTP Error: ' + error.status + ' ' + error.statusText,
            'URL: ' + error.url, 'Info: ' + error.error.message));
        }
      });
  }

  /*
   * Populate the side actions
   *
   */
  private populateSideActions() {
    this.sideActions = [
      new Action(AppIcons.shareIcon, 'Share'),
      new Action(AppIcons.saveIcon, 'Save'),
      new Action(AppIcons.watchIcon, 'Watch')
    ];
  }

}
