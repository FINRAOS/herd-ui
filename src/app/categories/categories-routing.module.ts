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
import { CategoryDetailComponent } from 'app/categories/components/category-detail/category-detail.component';
import { CategoryDetailResolverService } from 'app/categories/services/categories-detail-resolver';

// Base route is /categories defined in app-routing.module.ts
const routes: Routes = [
  {
    path: ':tagTypeCode/:tagCode',
    component: CategoryDetailComponent,
    resolve: {
      resolvedData: CategoryDetailResolverService,
    }
  },
  {
    path: ':tagTypeCode/:tagCode/:searchText',
    component: CategoryDetailComponent,
    resolve: {
      resolvedData: CategoryDetailResolverService,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CategoryDetailResolverService]
})
export class CategoriesRoutingModule {
}
