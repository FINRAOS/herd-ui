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
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sd-schema-columns',
  templateUrl: './schema-columns.component.html',
  styleUrls: ['./schema-columns.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchemaColumnsComponent implements OnInit {
  // TODO: remove this component as it is not needed anymore. do not use this compponent
  @Input() content: any;
  schemaCols = [{
        templateField: 'name',
        field: 'name',
        header: 'Name',
        hide: false,
        sortable: true,
        style: { 'width': '80px' }
    }, {
        templateField: 'type',
        field: 'type',
        header: 'Type',
        hide: false,
        sortable: true,
        style: { 'width': '80px'}
    }, {
        templateField: 'size',
        field: 'size',
        header: 'Size',
        hide: false,
        sortable: true,
        style: { 'width': '40px' }
    },
     {
        templateField: 'required',
        field: 'required',
        header: 'Required?',
        hide: false,
        sortable: true,
        style: { 'width': '60px' }
    }, {
        templateField: 'defaultValue',
        field: 'defaultValue',
        header: 'Default Value',
        hide: false,
        sortable: true,
        style: { 'width': '85px' }
    },
    {
        templateField: 'bDefColumnDescription',
        field: 'bDefColumnDescription',
        header: 'Description',
        hide: false,
        sortable: true,
        style: { 'width': '300px' }
    }]

  constructor() {
  }

  ngOnInit() {
  }

}
