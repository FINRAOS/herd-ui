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
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UrlSegment, ParamMap } from '@angular/router';

describe('CustomRouteReuseStrategy', () => {
    it('should return true for shouldReuseRoute if the current and future route configs are the same and they have the same params', () => {
        const strat = new CustomRouteReuseStrategy();
        const testConfig: ActivatedRouteSnapshot = {
            routeConfig: {
                path: 'test/:stuff',
                loadChildren: 'randomloadChildren#module'
            },
            params: {
                'test': 'param'
            },
            url: [],
            queryParams: {},
            fragment: '',
            data: {},
            outlet: 'primary',
            component: null,
            root: null,
            parent: null,
            firstChild: null,
            children: [],
            pathFromRoot: [],
            paramMap: {} as ParamMap,
            queryParamMap: {} as ParamMap
        } as ActivatedRouteSnapshot

        const curr = testConfig;
        const future = testConfig

        expect(strat.shouldReuseRoute(future, curr)).toBe(true);
    });

    it('should return false for shouldReuseRoute if the current and future route configs are not equal or params are not equal', () => {
        const routeConfig = {
            path: 'test/:stuff',
            loadChildren: 'randomloadChildren#module'
        };
        const strat = new CustomRouteReuseStrategy();
        const testConfig: ActivatedRouteSnapshot = {
            routeConfig,
            params: {
                'test': 'param'
            },
            url: [],
            queryParams: {},
            fragment: '',
            data: {},
            outlet: 'primary',
            component: null,
            root: null,
            parent: null,
            firstChild: null,
            children: [],
            pathFromRoot: [],
            paramMap: {} as ParamMap,
            queryParamMap: {} as ParamMap
        } as ActivatedRouteSnapshot
        const testConfig2: ActivatedRouteSnapshot = {
            routeConfig: {
                path: 'test/:stuff',
                loadChildren: 'randomloadChildren#module'
            },
            params: {
                'test': 'new param'
            },
            url: [],
            queryParams: {},
            fragment: '',
            data: {},
            outlet: 'primary',
            component: null,
            root: null,
            parent: null,
            firstChild: null,
            children: [],
            pathFromRoot: [],
            paramMap: {} as ParamMap,
            queryParamMap: {} as ParamMap
        } as ActivatedRouteSnapshot

        // due to hve different route config instances
        expect(strat.shouldReuseRoute(testConfig2, testConfig)).toBe(false);

        (testConfig2 as any).routeConfig = routeConfig;

        // due to having different params
        expect(strat.shouldReuseRoute(testConfig2, testConfig)).toBe(false);
    });

    it('should properly process retrieval of stored  Route Handles', () => {
        const strat = new CustomRouteReuseStrategy();
        const testConfig2: ActivatedRouteSnapshot = {
            url: [new UrlSegment('test', {})]
        } as ActivatedRouteSnapshot

        const testConfig: ActivatedRouteSnapshot = {
            pathFromRoot: [{}, testConfig2, {}, {}, {
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot

        // due to no route config
        expect(strat.retrieve(testConfig)).toBe(null);
        (testConfig as any).routeConfig = {
            path: 'url'
        }
        // due to not existing in storage
        expect(strat.retrieve(testConfig)).toBe(null);

        (testConfig as any).routeConfig.loadChildren = 'fakeLoadchildren#module.module';
        // due to having load children. these should never be stored.
        expect(strat.retrieve(testConfig)).toBe(null);

        delete (testConfig as any).routeConfig.loadChildren;

        // Note: as a side effect this also tests the store function
        const testHandle = { test: 'handle' };
        strat.store(testConfig, testHandle);

        // should be successful because we stored it
        expect(strat.retrieve(testConfig)).toBe(testHandle);
    });

    it('should properly process detach solution decision', () => {
        const strat = new CustomRouteReuseStrategy();
        const testConfig: ActivatedRouteSnapshot = {
            pathFromRoot: [{
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot
        // due to internal detach tracker not being set to true
        expect(strat.shouldDetach(testConfig)).toBe(false);

        // will set detach to true due to having differing route configs
        strat.shouldReuseRoute({ routeConfig: {} } as ActivatedRouteSnapshot, testConfig);

        // due to not having a routeConfig
        expect(strat.shouldDetach(testConfig)).toBe(false);

        (testConfig as any).routeConfig = { loadChildren: 'fakeLoadchildren#module.module' }

        // due to having loadChildren on routeConfig
        expect(strat.shouldDetach(testConfig)).toBe(false);
        delete (testConfig as any).routeConfig.loadChildren

        expect(strat.shouldDetach(testConfig)).toBe(true);
    });

    it('should make correct attach decision on shouldAttach', () => {
        const strat = new CustomRouteReuseStrategy();
        const testConfig: ActivatedRouteSnapshot = {
            pathFromRoot: [{
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot

        // due to not having routeConfig
        expect(strat.shouldAttach(testConfig)).toBe(false);

        (testConfig as any).routeConfig = { path: 'url' };

        // due to not existing in current storage
        expect(strat.shouldAttach(testConfig)).toBe(false);

        testConfig.params = {};
        testConfig.queryParams = {};
        strat.store(testConfig, { test: 'handle2' });

        // pass on defined params but empty values
        expect(strat.shouldAttach(testConfig)).toBe(true);

        testConfig.params.test = 'test';
        const paramsTest = {
            pathFromRoot: [{
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot
        paramsTest.params = { test: 'blah' }
        paramsTest.queryParams = {};
        strat.store(paramsTest, { test: 'handle3' });
        // fail on reqular params
        expect(strat.shouldAttach(testConfig)).toBe(false);

        testConfig.params = {};
        testConfig.queryParams.test = 'test';
        const queryParamsTest = {
            pathFromRoot: [{
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot
        queryParamsTest.params = {};
        queryParamsTest.queryParams = { test: 'notTest' }
        strat.store(queryParamsTest, { test: 'handle4' });
        // fail on query params
        expect(strat.shouldAttach(testConfig)).toBe(false);

        testConfig.params.test = 'paramsTest'
        testConfig.queryParams.test = 'queryParamsTest';
        const allTest = {
            pathFromRoot: [{
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot
        allTest.params = { test: 'paramsTest' }
        allTest.queryParams = { test: 'queryParamsTest' }
        strat.store(allTest, { test: 'handle5' });
        // pass on full params and query params existing
        expect(strat.shouldAttach(testConfig)).toBe(true);
    });

    it('should return properly formatted url for static method makeKey', () => {
        const testConfig2: ActivatedRouteSnapshot = {
            url: [new UrlSegment('test', {})]
        } as ActivatedRouteSnapshot

        const testConfig: ActivatedRouteSnapshot = {
            pathFromRoot: [{}, testConfig2, {}, {}, {
                url: [new UrlSegment('url', { 'id': '1' })]
            }]
        } as ActivatedRouteSnapshot

        expect(CustomRouteReuseStrategy.makeKey(testConfig)).toBe('/test/url;id=1');

        // returns 'emptyRoute' to be the key if the route has no url (root roote)
        expect(CustomRouteReuseStrategy.makeKey({
            pathFromRoot: [{}, {}, {}]
        } as ActivatedRouteSnapshot)).toBe('/');
    });

});
