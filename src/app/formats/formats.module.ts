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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {FormatsRoutingModule} from './formats-routing.module';
import {FormatDetailComponent} from 'app/formats/components/format-detail/format-detail.component';
import { SchemaColumnsComponent } from './components/schema-columns/schema-columns.component';
import { AttributeDefinitionsComponent } from './components/attribute-definitions/attribute-definitions.component';


@NgModule({
  imports: [
    CommonModule,
    FormatsRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [
    FormatDetailComponent,
    SchemaColumnsComponent,
    AttributeDefinitionsComponent
  ]
})
export class FormatsModule {
}
