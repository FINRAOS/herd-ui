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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import {SearchService} from '../shared/services/search.service';

@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    NgbModule
  ],
  providers: [
    SearchService
  ],
  declarations: [
    CategoryDetailComponent
  ]
})
export class CategoriesModule { }
