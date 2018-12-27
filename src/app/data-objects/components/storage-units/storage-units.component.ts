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
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NamespaceAuthorization, StorageUnit } from '@herd/angular-client';
import { AuthMap } from '../../../shared/directive/authorized/authorized.directive';

@Component({
  selector: 'sd-storage-units',
  templateUrl: './storage-units.component.html',
  styleUrls: ['./storage-units.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StorageUnitsComponent implements OnInit {

  @Input() namespace: string;
  @Input() storageUnits: StorageUnit[];
  @Output() downloadAFile = new EventEmitter<object | any>();
  attributesToShow = ['bucket.name', 'jdbc.url', 'jdbc.username', 'jdbc.user.credential.name'];
  authMap = AuthMap;
  editDescriptiveContentPermissions = [
    NamespaceAuthorization.NamespacePermissionsEnum.READ
  ];

  constructor() { }

  ngOnInit() {
  }

  downloadFile(storageFile, storage) {
    this.downloadAFile.emit({...storageFile, storage});
  }
}


