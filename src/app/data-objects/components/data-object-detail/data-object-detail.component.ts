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
import {BusinessObjectDataService, BusinessObjectFormat, BusinessObjectFormatService} from '@herd/angular-client';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {default as AppIcons} from '../../../shared/utils/app-icons';
import {Action} from '../../../shared/components/side-action/side-action.component';

export interface DataObjectDetailRequest {
  namespace: string,
  dataEntityName: string,
  formatUsage: string,
  formatFileType: string,
  partitionKey: string,
  partitionValue: string,
  subPartitionValues: string,
  formatVersion: number,
  dataObjectVersion: number,
  dataObjectStatus: string,
  includeDataObjectStatusHistory: boolean,
  includeStorageUnitStatusHistory: boolean
}

@Component({
  selector: 'sd-data-object-detail',
  templateUrl: './data-object-detail.component.html',
  styleUrls: ['./data-object-detail.component.scss']
})


export class DataObjectDetailComponent implements OnInit {
  private request: DataObjectDetailRequest;
  public sideActions;
  public businessObjectData;
  public businessObjectDataVersionSelected;
  public businessObjectDataVersions: number[] = [];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private businessObjectFormatApi: BusinessObjectFormatService,
    private businessObjectDataApi: BusinessObjectDataService) {

  }

  ngOnInit() {
    this.populateSideActions();
    this.activatedRoute.params.subscribe(params => {
      this.request = {
        namespace: params['namespace'],
        dataEntityName: params['dataEntityName'],
        formatUsage: params['formatUsage'],
        formatFileType: params['formatFileType'],
        partitionKey: undefined,
        partitionValue: params['partitionValue'],
        subPartitionValues: params['subPartitionValues'] || [],
        formatVersion: params['formatVersion'],
        dataObjectVersion: params['dataObjectVersion'],
        dataObjectStatus: undefined,
        includeDataObjectStatusHistory: true,
        includeStorageUnitStatusHistory: true
      };
      this.businessObjectDataVersionSelected = Number(params['dataObjectVersion']);
    });

    this.activatedRoute.data.subscribe((data) => {
      this.businessObjectData = data.resolvedData.businessObjectData;
      // Fetch the sub partition values
      if (this.businessObjectData.subPartitionValues) {
        this.businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat(
          this.request.namespace, this.request.dataEntityName,
          this.request.formatUsage, this.request.formatFileType,
          this.request.formatVersion).subscribe((formatResponse) => {
            this.businessObjectData.subPartitionKeys = this.findSubPartitionKeys(formatResponse);
          });
      }
    });

    this.getDataObjectVersions();
  }

  public getDataObjectVersions() {
    // Fetch the data object versions
    this.businessObjectDataApi.businessObjectDataGetBusinessObjectDataVersions(
      this.request.namespace,
      this.request.dataEntityName,
      this.request.formatUsage,
      this.request.formatFileType,
      this.request.partitionValue,
      this.request.subPartitionValues,
      this.request.formatVersion
    ).subscribe((response) => {
      // Fetch the data object version
      response.businessObjectDataVersions.map((businessObjectDataVersion) => {
        this.businessObjectDataVersions.push(Number(businessObjectDataVersion.businessObjectDataKey
          .businessObjectDataVersion));
      });

      // reverse sort the array
      this.businessObjectDataVersions.reverse();
    });
  }

  public go(businessObjectDataVersionSelected) {
    this.router.navigate(['/data-objects',
      this.request.namespace,
      this.request.dataEntityName,
      this.request.formatUsage,
      this.request.formatFileType,
      this.request.formatVersion,
      this.request.partitionValue,
      businessObjectDataVersionSelected,
      {
        subPartitionValues: this.request.subPartitionValues
      }]);
  };

  private populateSideActions() {
    this.sideActions = [
      new Action(AppIcons.shareIcon, 'Share'),
      new Action(AppIcons.saveIcon, 'Save'),
      new Action(AppIcons.watchIcon, 'Watch')
    ]
  }

  public findSubPartitionKeys(response: BusinessObjectFormat) {
    const result = {
      subPartitionKeys: []
    };
    if (response.schema) {
      if (response.schema.partitions) {
        response.schema.partitions.forEach((partition) => {
          result.subPartitionKeys.push(partition.name);
        });
      }
    }
    return result.subPartitionKeys;
  }

}
