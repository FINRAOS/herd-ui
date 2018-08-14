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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'codemirror/mode/go/go'; // styles for codemirror
import {
  BASE_PATH, ApiModule, Configuration
} from '@herd/angular-client';
import { CoreModule } from 'app/core/core.module';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from 'app/core/services/custom-route-reuse-strategy.service';
import { CustomLocation } from 'app/core/services/custom-location.service';
import { Location } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { HttpInterceptService } from './core/services/http-intercept.service';
import { InlineSVGService } from '../../node_modules/ng-inline-svg/lib/inline-svg.service';

export function appApiConfigFactory(): Configuration {
  return new Configuration();
}

export function restBasePathFactory(apiConfig: Configuration): string {
  apiConfig.withCredentials = !environment.useBasicAuth;
  if (environment.useBasicAuth && environment.basicAuthRestBaseUri) {
    return environment.basicAuthRestBaseUri;
  } else {
    return environment.restBaseUri;
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    CoreModule.forRoot(),
    ApiModule.forRoot(appApiConfigFactory)
  ],
  providers: [
    HttpInterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptService,
      multi: true
    },
    {
      provide: Configuration,
      useFactory: appApiConfigFactory,
      multi: false
    },
    {
      provide: BASE_PATH,
      useFactory: restBasePathFactory,
      deps: [Configuration]
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }, {
      provide: Location,
      useClass: CustomLocation
    },
    InlineSVGService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
