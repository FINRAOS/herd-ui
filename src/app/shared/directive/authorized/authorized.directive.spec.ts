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
import {AuthorizedDirective, AuthMap} from './authorized.directive';
import {UserService} from '../../../core/services/user.service';
import {Component, ElementRef, Input, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import { UserAuthorizations, NamespaceAuthorization } from '@herd/angular-client';
import { By } from '@angular/platform-browser';

/*
 * @description fake component to test directive
 */
@Component({
  template: `
    <div sdAuthorized
    [namespace]="'test_ns_2'"
    [securityFunction]="authMap.editDescriptiveInfo"
    [namespacePermissions]="'READ'">test_ns_2</div>
    <div sdAuthorized
    [namespace]="'test_ns_2'"
    [securityFunction]="authMap.editDescriptiveInfo"
    [namespacePermissions]="'WRITE'">test_ns_2.1</div>
    <div sdAuthorized
    [namespace]="'test_ns_2'"
    [securityFunction]="authMap.editDescriptiveInfo"
    [displayUnAuthorized]="'show'"
    [namespacePermissions]="'WRITE'">test_ns_2.2</div>
    <div sdAuthorized
    [namespace]="'test_ns_1'"
    [securityFunction]="authMap.editDescriptiveInfo"
    [namespacePermissions]="['GRANT', 'WRITE']">test_ns_1</div>
    <div sdAuthorized
    [namespace]="'test_ns_1'"
    [securityFunction]="'random_other_function'"
    [namespacePermissions]="['WRITE', 'GRANT']">test_ns_1.1</div>
    <div sdAuthorized
    [namespace]="finalNs"
    [securityFunction]="finalSecurityFunction"
    [namespacePermissions]="finalNsPermissions"> nothing passed</div>`
})
export class TestAuthorizedDirectiveComponent {

  @Input() permission;

  authMap = AuthMap;

  finalNsPermissions = null;
  finalNs = null;
  finalSecurityFunction = null;
  constructor() {
  }
}

describe('AuthorizedDirective', () => {

  let fixture: ComponentFixture<TestAuthorizedDirectiveComponent>;
  let component: TestAuthorizedDirectiveComponent;
  let element;
  let des: DebugElement[];
  const userInfo: UserAuthorizations = {
    userId: 'Test_User',
    namespaceAuthorizations: [{
      namespace: 'test_ns_1',
      namespacePermissions: [
        NamespaceAuthorization.NamespacePermissionsEnum.READ,
        NamespaceAuthorization.NamespacePermissionsEnum.WRITE,
      ]
    }, {
      namespace: 'test_ns_2',
      namespacePermissions: [
        NamespaceAuthorization.NamespacePermissionsEnum.READ,
      ]
    }],
    securityFunctions: [
      AuthMap.editDescriptiveInfo
    ]
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        TestAuthorizedDirectiveComponent,
        AuthorizedDirective
      ],
      providers: [
        {provide: UserService, useValue: { get user() { return Observable.of(userInfo) } } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TestAuthorizedDirectiveComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const service = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();

    // all elements with an attached HighlightDirective
    des = fixture.debugElement.queryAll(By.directive(AuthorizedDirective));
  });

  it('should create an instance of test component', () => {
    expect(TestAuthorizedDirectiveComponent).toBeTruthy();
  });

  it('should display element when properly configured with string based singular namespacePermission', () => {
    const display = window.getComputedStyle(des[0].nativeElement).display;
    expect(display).toBe('block');
  });

  it('should hide element when namespacePermission does not exist in user context', () => {
    const display = window.getComputedStyle(des[1].nativeElement).display;
    expect(display).toBe('none');
  });

  it('should show element when not authorized and displayUnauthorized is set to show', () => {
    const display = window.getComputedStyle(des[2].nativeElement).display;
    expect(display).toBe('block');
  });

  it('should show element when multiple namespacePermissions are set to be checked and one exists', () => {
    const display = window.getComputedStyle(des[3].nativeElement).display;
    expect(display).toBe('block');
  });

  it('should hide element when securityFunction does not match at least one user securityFunction', () => {
    const display = window.getComputedStyle(des[4].nativeElement).display;
    expect(display).toBe('none');
  });

  it('should properly compile when nothing is passed at all', async(() => {
    let display = window.getComputedStyle(des[5].nativeElement).display;
    expect(display).toBe('none');

    component.finalNs = 'test_ns_1';
    component.finalNsPermissions = 'WRITE';
    fixture.detectChanges();
    display = window.getComputedStyle(des[5].nativeElement).display;
    // still no securityFunction set
    expect(display).toBe('none');

    component.finalSecurityFunction = AuthMap.editDescriptiveInfo;
    fixture.detectChanges();
    display = window.getComputedStyle(des[5].nativeElement).display;
    expect(display).toBe('block');
  }));
});
