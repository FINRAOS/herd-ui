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
import { EncryptionService } from './../shared/services/encryption.service';
import { GoogleAnalyticsService } from './../shared/services/google-analytics.service';
import { UserService } from './services/user.service';
import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HomeComponent } from 'app/core/components/home/home.component';
import { HeaderComponent } from 'app/core/components/header/header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'app/core/components/alerts/alerts.component';
import { BackTrackComponent } from './components/back-track/back-track.component';
import { AuthGuardService } from 'app/core/services/auth-guard.service';
import { CookieService } from 'ng2-cookies';
import { AlertService } from 'app/core/services/alert.service';
import { NoAuthGuardService } from 'app/core/services/no-auth-guard.service';
import { LoginComponent } from 'app/core/components/login/login.component';

export const WINDOW = new InjectionToken<any>('A reference to the window');

export function windowFactory() {
  return window;
}

@NgModule({
  imports: [
    RouterModule,
    NgbModule,
    SharedModule
  ],
  declarations: [HeaderComponent, HomeComponent, BackTrackComponent, AlertsComponent, LoginComponent],
  exports: [HeaderComponent, HomeComponent, BackTrackComponent, AlertsComponent, LoginComponent, SharedModule]
})
export class CoreModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        NoAuthGuardService,
        AuthGuardService,
        CookieService,
        AlertService,
        {
          provide: WINDOW,
          useFactory: windowFactory
        },
        UserService,
        EncryptionService,
        GoogleAnalyticsService]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
