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
import { BeastService, BeastEvent } from './beast.service';
import { inject, TestBed } from '@angular/core/testing';

fdescribe('Beast Service', () => {

  const postParams: BeastEvent = <BeastEvent>{};
  postParams.component = 'Homepage';
  postParams.action = 'View';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BeastService,
        {
          provide: UserService,
          useValue: {
            userAuthorizations: {userId: 'K30199@gmail.com'}
          }
        }
      ]
    });
  });

  it('should be defined', inject([BeastService, UserService], (beastService: BeastService, cu: UserService) => {
    expect(beastService).toBeTruthy();
  }));

  it('should return mapped components', inject([BeastService], (
    beastService: BeastService) => {
    const url1 = 'test.com';
    const res1 = beastService.mapUrlToComponent(url1);
    expect(res1).toEqual('Homepage');

    const url2 = 'test.com/tag';
    const res2 = beastService.mapUrlToComponent(url2);
    expect(res2).toEqual('Tag');

    const url3 = 'test.com/formats';
    const res3 = beastService.mapUrlToComponent(url3);
    expect(res3).toEqual('Formats');

    const url4 = 'test.com/data-entities';
    const res4 = beastService.mapUrlToComponent(url4);
    expect(res4).toEqual('Data Entities');

    const url5 = 'test.com/data-objects';
    const res5 = beastService.mapUrlToComponent(url5);
    expect(res5).toEqual('Data Objects');

    const url6 = 'test.com/search';
    const res6 = beastService.mapUrlToComponent(url6);
    expect(res6).toEqual('Global Search');
  }));

  it('should return correct BeastEvent Data', inject([BeastService, UserService], (
    beastService: BeastService, cu: UserService) => {
    const res = beastService.createEvent(postParams);
    expect(JSON.parse(res).eventId).toEqual('K30199');
  }));

  it('should send data to beast service', inject([BeastService, UserService], (
    beastService: BeastService) => {
    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
    spyOn(XMLHttpRequest.prototype, 'send');
    // const bsSpy = spyOn(beastService, 'postEvent');
    beastService.postEvent(postParams);
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
  }));

  it('should send action event to beast service', inject([BeastService, UserService], (
    beastService: BeastService) => {
    const bsSpy = spyOn(beastService, 'postEvent');
    beastService.sendBeastActionEvent('View', 'Homepage');
    expect(bsSpy).toHaveBeenCalled();
  }));

});
