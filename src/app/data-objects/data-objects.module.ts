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
import {NgModule} from '@angular/core';
import {DataObjectsRoutingModule} from './data-objects-routing.module';
import {DataObjectDetailComponent} from 'app/data-objects/components/data-object-detail/data-object-detail.component';
import {DataObjectListComponent} from 'app/data-objects/components/data-object-list/data-object-list.component';
import {SharedModule} from 'app/shared/shared.module';
import {DataObjectListFiltersComponent} from './components/data-object-list-filters/data-object-list-filters.component';
import {FilterTemplateComponent} from './components/filter-template/filter-template.component';
import {PartitionFilterComponent} from './components/partition-filter/partition-filter.component';
import {AttributeFilterComponent} from './components/attribute-filter/attribute-filter.component';
import {LatestValidVersionFilterComponent} from './components/latest-valid-version-filter/latest-valid-version-filter.component';
import {LineageComponent} from './components/lineage/lineage.component';
import {StorageUnitsComponent} from './components/storage-units/storage-units.component';
import {CodemirrorModule} from 'ng2-codemirror';
import {ClipboardModule} from 'ngx-clipboard';

@NgModule({
  imports: [
    CodemirrorModule,
    ClipboardModule,
    DataObjectsRoutingModule,
    SharedModule
  ],
  declarations: [
    DataObjectDetailComponent,
    DataObjectListComponent,
    DataObjectListFiltersComponent,
    FilterTemplateComponent,
    PartitionFilterComponent,
    AttributeFilterComponent,
    LatestValidVersionFilterComponent,
    LineageComponent,
    StorageUnitsComponent
  ]
})
export class DataObjectsModule {
}
