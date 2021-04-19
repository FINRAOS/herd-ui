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
import { GoogleAnalyticsService } from './../../services/google-analytics.service';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FacetComponent } from './facet.component';
import { HttpClientModule } from '@angular/common/http';
import { IndexSearchMockData } from 'testing/IndexSearchMockData';
import { EventEmitter, NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { Facet } from '@herd/angular-client';
import { TriStateEnum } from 'app/shared/components/tri-state/tri-state.component';
import { FacetTriState } from 'app/shared/services/facet-tri-state.enum';

describe('FacetComponent', () => {
  const mockData: IndexSearchMockData = new IndexSearchMockData();
  let component: FacetComponent;
  let fixture: ComponentFixture<FacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      declarations: [
        FacetComponent,
      ],
      providers: [
        {
          provide: GoogleAnalyticsService,
          useValue: {
            sendEventData: jasmine.createSpy('sendEventData')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('PropageSelection method is propagating facet changes from the service in default state', async(
    inject([GoogleAnalyticsService], (ga: GoogleAnalyticsService) => {

      const childFacets = {fieldName: 'description', fragments: ['kamal', 'managets']};
      const event = {
        fieldName: 'description', fragments: ['kamal', 'managets'],
        facetState: FacetTriState.default
      };

      component.facetChange = new EventEmitter<Object>();
      const spyGA = (<jasmine.Spy>ga.sendEventData).and.callThrough();
      component.propagateSelection(event, childFacets, mockData.indexSearchResponse['facets'][0]);
      expect(spyGA.calls.count()).toEqual(0);

    })));

  it('clear facet is clearing selected facets and refreshing search', async(() => {
    component.facets = mockData.facets;
    fixture.detectChanges();
    component.clearFacets();
    const firstFacet: Facet = component.viewFacets[0];
    expect(firstFacet.facets[0]['state']).toBe(0);
  }));

  it('should process ngOnChange properly', async(() => {
    // if there are no changes nothing happens
    let changeObject: SimpleChanges = {};
    component.ngOnChanges(changeObject);
    expect(component.viewFacets).toBe(undefined);

    // if there are changes and it is the first change nothing happens
    changeObject = {facets: new SimpleChange(undefined, null, true)};
    component.ngOnChanges(changeObject);
    expect(component.viewFacets).toBe(undefined);

    // if there are changes and viewFacets should be reinitialized
    component.newSearch = true;
    changeObject = {facets: new SimpleChange(undefined, mockData.facets, false)};
    component.ngOnChanges(changeObject);
    expect(component.viewFacets).toEqual(mockData.facets, 'view facets weren\'t updated properly for newSearch = true');

    // if there are changes and facet counts should be updated (newSearch = false);
    component.newSearch = false;
    // take out 1 set of the facets so the private updateFacetCount is fully tested
    // for negative if
    const newFacetData: Facet[] = [...mockData.facets];
    // simulate change of count
    newFacetData[0].facets[0].facetCount = 42;
    // simulate taking out a facet for the response return
    newFacetData.splice(1, 1);

    const newExpectedFacets = [...component.viewFacets];
    newExpectedFacets[1].facets.forEach((childFacet) => {
      childFacet.facetCount = 0;
    });
    newExpectedFacets[0].facets[0].facetCount = 42;

    changeObject = {facets: new SimpleChange(mockData.facets, newFacetData, false)};
    component.ngOnChanges(changeObject);
    expect(component.viewFacets).toEqual(newExpectedFacets);
  }));

  it('send data to google analytics on facet event change', async(
    inject([GoogleAnalyticsService], (ga: GoogleAnalyticsService) => {
      const childFacets = {fieldName: 'description', fragments: ['kamal', 'managets']};
      const event = {
        fieldName: 'description', fragments: ['kamal', 'managets'],
        facetState: TriStateEnum.State2
      };
      component.facetChange = new EventEmitter<Object>();
      const spyGA = (<jasmine.Spy>ga.sendEventData).and.callThrough();
      component.propagateSelection(event, childFacets, mockData.indexSearchResponse['facets'][0]);
      expect(spyGA.calls.count()).toEqual(1);
    })));
});
