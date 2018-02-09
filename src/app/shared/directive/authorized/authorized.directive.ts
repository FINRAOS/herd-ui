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
import {Directive, ElementRef, Input, OnInit, OnChanges} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import { UserAuthorizations, NamespaceAuthorization} from '@herd/angular-client';

export class AuthMap {
  static editSmes = 'FN_BUSINESS_OBJECT_DEFINITION_SUBJECT_MATTER_EXPERTS_POST';
  static editTags = 'FN_BUSINESS_OBJECT_DEFINITION_TAGS_POST';
  static editDescriptiveInfo = 'FN_BUSINESS_OBJECT_DEFINITIONS_DESCRIPTIVE_INFO_PUT';
  static getBData = 'FN_BUSINESS_OBJECT_DATA_BY_BUSINESS_OBJECT_DEFINITION_GET';
  static editRecommendedFormat = 'FN_BUSINESS_OBJECT_DEFINITIONS_DESCRIPTIVE_INFO_PUT';
  static editBdefColumn = 'FN_BUSINESS_OBJECT_DEFINITION_COLUMNS_PUT';
  // Using delete but the functionality is using both POST and DELETE
  static deleteBdefColumn = 'FN_BUSINESS_OBJECT_DEFINITION_COLUMNS_DELETE';
}

@Directive({
  selector: '[sdAuthorized]'
})
export class AuthorizedDirective implements OnInit, OnChanges {

  /**
   * @description if nothing provided, then it will consider as hide the element. Else it will show the element.
   */
  @Input() displayUnAuthorized: 'show' | 'none';
  @Input() securityFunction: string;
  @Input() namespace: string;
  @Input() namespacePermissions: NamespaceAuthorization.NamespacePermissionsEnum | NamespaceAuthorization.NamespacePermissionsEnum [];
  private currentUser: UserAuthorizations;
  private oldDisplayProperty: string;

  constructor(private elementRef: ElementRef, private currentUserService: UserService) {

  }

  ngOnInit() {
    this.displayUnAuthorized = this.displayUnAuthorized || 'none';
    this.oldDisplayProperty = this.elementRef.nativeElement.style.display;
    this.elementRef.nativeElement.style.display = this.displayUnAuthorized;
    this.currentUserService.user.subscribe((user) => {
      this.currentUser = user;
      this.ngOnChanges();
    });
  }

  ngOnChanges() {
    if (this.authorized()) {
      this.elementRef.nativeElement.style.display = (this.displayUnAuthorized === 'none') ? this.oldDisplayProperty : 'none';
    }
  }

  /**
   * @description User is authorized against security functions and namespace
   * @returns {boolean}
   */
  authorized() {
    return this.matchNamespace() && this.matchSecurityFunctions();
  }

  private matchSecurityFunctions() {
    if (this.securityFunction && this.currentUser && this.currentUser.securityFunctions) {
      return this.currentUser.securityFunctions.includes(this.securityFunction);
    }
    return false;
  }

  private matchNamespace() {
    if (this.namespace && this.currentUser && this.currentUser.namespaceAuthorizations) {
      return this.currentUser.namespaceAuthorizations.some((nAuth) => {
        if (this.namespace === nAuth.namespace) {
          if (typeof this.namespacePermissions === 'string' ) {
            return nAuth.namespacePermissions.includes(this.namespacePermissions);
          } else {
            const perms = this.namespacePermissions as NamespaceAuthorization.NamespacePermissionsEnum[];
            return nAuth.namespacePermissions.some((permission) => {
              return perms.includes(permission);
            });
          }
        }
        return false;
      });
    }

    return false;
  }
}
