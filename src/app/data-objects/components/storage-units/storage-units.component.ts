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
import { Component, Input, OnInit, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { StorageUnit } from '@herd/angular-client';

@Component({
  selector: 'sd-storage-units',
  templateUrl: './storage-units.component.html',
  styleUrls: ['./storage-units.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StorageUnitsComponent implements OnInit, OnChanges {

  @Input() storageUnits: StorageUnit[];
  unitsWithAttrMap: {[Property in keyof StorageUnit]?} & { attrMap?: { [attrName: string]: string } }[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.unitsWithAttrMap = this.storageUnits ? this.storageUnits.map(unit => {
      return { ...unit, attrMap: this.createAttributeValueMap(unit) };
    }) : [];
  }

  createAttributeValueMap(storageUnit: StorageUnit): { [attrName: string]: string } {
    return storageUnit.storage.attributes && storageUnit.storage.attributes.reduce((map, attr) => {
      const retMap = { ...map };
      retMap[attr.name] = attr.value;
      return retMap;
    }, {});
  }
}


