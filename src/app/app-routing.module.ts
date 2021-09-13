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
import { HomeComponent } from 'app/core/components/home/home.component';
import { AuthGuardService } from 'app/core/services/auth-guard.service';
import { LoginComponent } from './core/components/login/login.component';
import { NoAuthGuardService } from 'app/core/services/no-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          resolvedData: {
            title: 'Home'
          },
          ignorePreviousTitle: true
        }
      }, {
        path: 'data-entities',
        loadChildren: 'app/data-entities/data-entities.module#DataEntitiesModule'
      }, {
        path: 'tags',
        loadChildren: 'app/categories/categories.module#CategoriesModule'
      }, {
        path: 'data-objects',
        loadChildren: 'app/data-objects/data-objects.module#DataObjectsModule'
      }, {
        path: 'search',
        loadChildren: 'app/search/search.module#SearchModule'
      }, {
        path: 'formats',
        loadChildren: 'app/formats/formats.module#FormatsModule'
      }]
  },
  {
    path: 'login',
    canActivate: [NoAuthGuardService],
    component: LoginComponent,
    data: {
      resolvedData: {
        title: 'Login'
      },
      excludeFromCaching: true,
      ignorePreviousTitle: true
    }
  }, {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
