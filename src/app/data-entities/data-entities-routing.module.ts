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
import { RouterModule, Routes } from '@angular/router';
import { DataEntityListComponent } from 'app/data-entities/components/data-entity-list/data-entity-list.component';
import { DataEntityDetailComponent } from 'app/data-entities/components/data-entity-detail/data-entity-detail.component';
import { DataEntityListResolverService } from 'app/data-entities/services/data-entity-list-resolver';
import { DataEntityDetailResolverService } from 'app/data-entities/services/data-entity-detail-resolver';
// Base route is /data-entities defined in app-routing.module.ts
const routes: Routes = [{
  path: ':namespace/:dataEntityName',
  component: DataEntityDetailComponent,
  resolve: {
    resolvedData: DataEntityDetailResolverService,
  }
}, {
  path: '',
  component: DataEntityListComponent,
  data: {
    ignorePreviousTitle: true // cancel using previous title
  },
  resolve: {
    resolvedData: DataEntityListResolverService,
  },
  runGuardsAndResolvers: 'always'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    DataEntityListResolverService,
    DataEntityDetailResolverService
  ]
})
export class DataEntitiesRoutingModule {
}
