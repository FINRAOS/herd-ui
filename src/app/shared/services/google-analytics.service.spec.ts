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
import { UserService } from 'app/core/services/user.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';

declare var window: any;
let ga: jasmine.Spy;
let warn: jasmine.Spy | Function;
const originalWarn = window.console.warn;
describe('Google Analytics Service', () => {

  const url = '/data-entity';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleAnalyticsService,
        {
          provide: UserService,
          useValue: {
            encryptedUserIdentifier: 'encryptedUserIdentifier'
          }
        }
      ]
    });

    window.ga = ga = jasmine.createSpy('ga');
    // for the test take out the warnings to clear logs a bit
    window.console.warn = warn = jasmine.createSpy('warn');
  });

  afterAll(() => {
    // set the warn back
    window.console.warn = originalWarn;
  });

  describe('with trackAnalytics turned on', () => {

    it('should initialize google analytics if trackAnalytics is set to true and trackingId exists',
      inject([GoogleAnalyticsService], (googleAnalyticsService: GoogleAnalyticsService) => {
      expect(ga).toHaveBeenCalledWith('create', '{{TRACKING_ID}}', 'auto');
    }));

    it('should send data to google analytics', inject([GoogleAnalyticsService, UserService], (
      service: GoogleAnalyticsService, cu: UserService) => {
      service.sendPageViewData(url);
      expect(ga).toHaveBeenCalledWith('set', 'page', url);
      expect(ga).toHaveBeenCalledWith('set', 'dimension1', cu.encryptedUserIdentifier);
      expect(ga).toHaveBeenCalledWith('set', 'userId', cu.encryptedUserIdentifier);
      expect(ga).toHaveBeenCalledWith('send', 'pageview');
    }));

    it('should send facet event to google analytics', inject([GoogleAnalyticsService, UserService], (
      service: GoogleAnalyticsService, cu: UserService) => {
      service.sendEventData('Global Search Facets', 'include', 'facetName');
      expect(ga).toHaveBeenCalledWith('send', 'event', 'Global Search Facets', 'include', 'facetName',
        { 'dimension1': cu.encryptedUserIdentifier });
    }));

  });


  describe('with trackAnalytics turned off', () => {
    beforeEach( inject([], () => {
      environment.trackAnalytics = false;
    }));

    it('should not initialize google analytics if trackAnalytics is not set or false', inject([GoogleAnalyticsService], () => {
      expect(ga).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(`Google Analytics has not been configured for this deployment.
      Either trackAnalytics has not been set in the configuration.json or ga.trackingId has not been provided in the configuration.`);
    }));

    it('should not send data to google analytics', inject([GoogleAnalyticsService], (
      service: GoogleAnalyticsService) => {
      service.sendPageViewData(url);
      expect(ga).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(`Google Analytics has not been configured for this deployment.
      Either trackAnalytics has not been set in the configuration.json or ga.trackingId has not been provided in the configuration.`);
    }));

    it('should send facet event to google analytics', inject([GoogleAnalyticsService], (
      service: GoogleAnalyticsService) => {
      service.sendEventData('event', 'action', 'label');
      expect(ga).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(`Google Analytics has not been configured for this deployment.
      Either trackAnalytics has not been set in the configuration.json or ga.trackingId has not been provided in the configuration.`);
    }));
  });

});
