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
import { CustomLocation } from './custom-location.service';
import { TestBed, inject } from '@angular/core/testing';
import { WINDOW } from 'app/core/core.module';
import { LocationStrategy, Location } from '@angular/common';

describe('CustomLocationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{
                provide: WINDOW,
                useValue: {
                    history: { state: null }
                }

            }, {
                provide: Location,
                useClass: CustomLocation
            }, {
                provide: LocationStrategy,
                useValue: {
                    onPopState: jasmine.createSpy('onPopState'), // mocked out for super constructor
                    replaceState: jasmine.createSpy('replaceState'),
                    pushState: jasmine.createSpy('pushState'),
                    getBaseHref: jasmine.createSpy('getBaseHref').and.returnValue('/'),
                    path: jasmine.createSpy('path').and.returnValue('/testUrlPath')
                }
            }]
        });
    });

    it('should return current history state', inject([WINDOW, Location], (w: { history: { state: any } }, loc: CustomLocation) => {
        w.history.state = { test: 'testState' }
        expect(loc.getHistoryState()).toBe(w.history.state);
    }));

    it('should use platformStrategy\'s pushState on createHistoryState', inject([LocationStrategy, Location],
        (locStrat: LocationStrategy, loc: CustomLocation) => {
            loc.createHistoryState({ test: 'state' }, 'testTitle', '/testUrl', '?testParams=true');
            expect(locStrat.pushState).toHaveBeenCalledWith({ test: 'state' }, 'testTitle', '/testUrl', '?testParams=true');

            loc.createHistoryState({ test: 'state' }, 'testTitle', '/testUrl');
            expect(locStrat.pushState).toHaveBeenCalledWith({ test: 'state' }, 'testTitle', '/testUrl', '');
        }));

    it('should not completely overwrite when replaceState is used', inject([WINDOW, LocationStrategy, Location],
        (w: { history: { state: any } }, locStrat: LocationStrategy, loc: CustomLocation) => {
            // predefined state is null so the call will be null
            loc.replaceState('/testPath', '?testQuery=true');
            expect(locStrat.replaceState).toHaveBeenCalledWith(null, '', '/testPath', '?testQuery=true');

            // predefined state is not null so the replaceState will be done with that state to maintain it.
            w.history.state = { test: 'testState' }
            loc.replaceState('/testPath');
            expect(locStrat.replaceState).toHaveBeenCalledWith({ test: 'testState' }, '', '/testPath', '');
        }));


    it('should use platformStrategy\'s replaceState to update and replace history state', inject([LocationStrategy, Location],
        (locStrat: LocationStrategy, loc: CustomLocation) => {
            loc.updateHistoryState({ test: 'state' }, 'testTitle', '/testUrl', '?testParams=true');
            expect(locStrat.replaceState).toHaveBeenCalledWith({ test: 'state' }, 'testTitle', '/testUrl', '?testParams=true');

            loc.updateHistoryState({ test: 'state' }, 'testTitle', '/testUrl');
            expect(locStrat.replaceState).toHaveBeenCalledWith({ test: 'state' }, 'testTitle', '/testUrl', '');
        }));

    it('should merge existing state with sent state', inject([WINDOW, LocationStrategy, Location],
        (w: { history: { state: any } }, locStrat: LocationStrategy, loc: CustomLocation) => {
            // when initial state starts as null will still 'merge' on an empty object
            loc.mergeState({ new: 'state' });
            expect(locStrat.replaceState).toHaveBeenCalledWith({ new: 'state' }, '', '/testUrlPath', '');

            // when initial has a key the key is overwritten -- new state is merged into object
            w.history.state = { new: 'state' };
            loc.mergeState({ new: 'mergedState', test: 'state' });
            expect(locStrat.replaceState).toHaveBeenCalledWith({ new: 'mergedState', test: 'state' }, '', '/testUrlPath', '');

            // functions are not included in merges
            w.history.state = { new: 'mergedState', test: 'state' };
            loc.mergeState({ new: 'mergedState', test: 'state', func: () => void 0 });
            expect(locStrat.replaceState).toHaveBeenCalledWith({ new: 'mergedState', test: 'state' }, '', '/testUrlPath', '');
        }));

});
