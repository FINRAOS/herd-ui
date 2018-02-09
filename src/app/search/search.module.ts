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
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from 'app/search/components/search/search.component';
import {SharedModule} from '../shared/shared.module';
import {SearchService} from './components/search/search.service';
import {IndexSearchService, BASE_PATH} from '@herd/angular-client';
import {ConfigService} from '../core/services/config.service';
import {appInitFactory, AppInitService} from '../core/services/app-init.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    SearchRoutingModule,
    SharedModule
  ],
  providers: [
    SearchService
  ],
  declarations: [
    SearchComponent,
  ]
})
export class SearchModule {
}
