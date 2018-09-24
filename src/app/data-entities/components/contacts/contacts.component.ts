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
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  BusinessObjectDefinitionSubjectMatterExpertService,
  NamespaceAuthorization,
  SubjectMatterExpertService
} from '@herd/angular-client';
import { AlertService, DangerAlert } from '../../../core/services/alert.service';
import { AuthMap } from '../../../shared/directive/authorized/authorized.directive';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'sd-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnChanges {
  authMap = AuthMap;
  @Input() namespace: string;
  @Input() businessObjectDefinitionName: string;
  @Input() contacts: any;

  editDescriptiveContentPermissions = [NamespaceAuthorization.NamespacePermissionsEnum.WRITE,
    NamespaceAuthorization.NamespacePermissionsEnum.WRITEDESCRIPTIVECONTENT];
  userId: string;
  validationError = '';
  displayingContacts: Array<any> = [];
  public hover = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private alertService: AlertService,
    private businessObjectDefinitionSubjectMatterExpert: BusinessObjectDefinitionSubjectMatterExpertService,
    private subjectMatterExpertApi: SubjectMatterExpertService,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.querySelector('.card').style.display = 'none';
    this.displayingContacts = this.contacts || [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayingContacts = changes.contacts.currentValue;
  }

  onMouseEnter(event: any) {
    this.hover = true;
    this.elementRef.nativeElement.addClass = 'edit';
  }

  onMouseLeave(event: any) {
    this.hover = false;
    this.elementRef.nativeElement.addClass = 'un-edit';
  }

  click() {
    this.elementRef.nativeElement.querySelector('.contacts-content').style.display = 'none';
    this.elementRef.nativeElement.querySelector('.card').style.display = '';
  }

  editDone() {
    this.elementRef.nativeElement.querySelector('.contacts-content').style.display = '';
    this.elementRef.nativeElement.querySelector('.card').style.display = 'none';
  }

  save() {
    const request = {
      businessObjectDefinitionSubjectMatterExpertKey: {
        namespace: this.namespace,
        businessObjectDefinitionName: this.businessObjectDefinitionName,
        userId: this.userId
      }
    };
    if (this.userId) {
      this.validationError = '';
      this.subjectMatterExpertApi.defaultHeaders.append('skipAlert', 'true');
      this.businessObjectDefinitionSubjectMatterExpert.defaultHeaders.append('skipAlert', 'true');
      this.subjectMatterExpertApi.subjectMatterExpertGetSubjectMatterExpert(this.userId).pipe(finalize(() => {
        this.subjectMatterExpertApi.defaultHeaders.delete('skipAlert');
      })).subscribe((sme) => {
        this.businessObjectDefinitionSubjectMatterExpert
          .businessObjectDefinitionSubjectMatterExpertCreateBusinessObjectDefinitionSubjectMatterExpert(request).pipe(finalize(() => {
          this.businessObjectDefinitionSubjectMatterExpert.defaultHeaders.delete('skipAlert');
        })).subscribe((response) => {
          this.displayingContacts.push(sme);
          this.userId = '';
        }, (error) => {
          this.alertService.alert(new DangerAlert('Unable to store.', 'There is a problem while storing user id.', error));
        });
      }, (error) => {
        this.alertService.alert(new DangerAlert('Invalid user id.', 'User id as its not available!', error));
      });

    } else {
      this.validationError = 'Please enter user id.'
    }
  }

  remove(event: any) {
    this.businessObjectDefinitionSubjectMatterExpert.defaultHeaders.append('skipAlert', 'true');
    this.businessObjectDefinitionSubjectMatterExpert
      .businessObjectDefinitionSubjectMatterExpertDeleteBusinessObjectDefinitionSubjectMatterExpert(
        this.namespace, this.businessObjectDefinitionName, event.subjectMatterExpertKey.userId)
      .pipe(finalize(() => {
        this.businessObjectDefinitionSubjectMatterExpert.defaultHeaders.delete('skipAlert');
      }))
      .subscribe((response) => {
        this.displayingContacts = this.displayingContacts.filter((key) => {
          return !(key.contactDetails.emailAddress === event.contactDetails.emailAddress);
        });
      }, (error) => {
        this.alertService.alert(new DangerAlert('Unable to delete.', 'There is a problem while deleting user id', error));

      });
  }
}
