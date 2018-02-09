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
import { NgModule } from '@angular/core';
import { DataEntitiesRoutingModule } from './data-entities-routing.module';
import { DataEntityListComponent } from 'app/data-entities/components/data-entity-list/data-entity-list.component';
import { DataEntityDetailComponent } from 'app/data-entities/components/data-entity-detail/data-entity-detail.component';
import { SharedModule } from '../shared/shared.module';
import {CodemirrorModule} from 'ng2-codemirror';
import {ClipboardModule} from 'ngx-clipboard';
import { TagsComponent } from './components/tags/tags.component';
import { ContactsComponent } from './components/contacts/contacts.component';

@NgModule({
  imports: [
    CodemirrorModule,
    ClipboardModule,
    DataEntitiesRoutingModule,
    SharedModule
  ],
  declarations: [DataEntityListComponent, DataEntityDetailComponent, TagsComponent, ContactsComponent]
})
export class DataEntitiesModule { }
