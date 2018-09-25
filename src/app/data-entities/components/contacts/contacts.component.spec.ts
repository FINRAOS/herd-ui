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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessObjectDefinitionSubjectMatterExpertService, SubjectMatterExpertService } from '@herd/angular-client';
import { ContactsComponent } from './contacts.component';
import { AuthorizedDirective } from '../../../shared/directive/authorized/authorized.directive';
import { SharedModule } from '../../../shared/shared.module';
import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core/services/user.service';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

const userRoles = {
  'authorizedUserRoles': {
    'securityRoles': [
      'TEST_APP', 'TEST_ADMIN', 'TEST_READ', 'TEST_WRITE'
    ],
    'namespaceAuthorizations': [
      {
        'namespace': 'TESTNAMESPACE',
        'namespacePermissions': [
          'READ', 'WRITE', 'EXECUTE', 'GRANT'
        ]
      },
      {
        'namespace': 'TESTNAMESPACE1',
        'namespacePermissions': [
          'READ', 'WRITE', 'EXECUTE', 'GRANT'
        ]
      },
      {
        'namespace': 'TESTNAMESPACE2',
        'namespacePermissions': [
          'READ', 'WRITE', 'EXECUTE', 'GRANT'
        ]
      }
    ]
  },
  'UnAuthorizedUserRoles': {
    'securityRoles': [
      'TEST_APP_NONE'
    ]
  }
};

export class MockUser {
  public user = new BehaviorSubject(userRoles.authorizedUserRoles);

  public getCurrentUser() {
    return of({
      'securityRoles': [
        'TEST_APP'
      ]
    });
  }
}


describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let businessObjectDefinitionSubjectMatterExpertApi, subjectMatterExpertApi;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NgbModule.forRoot(),
        HttpClientTestingModule,
        HttpClientModule
      ],
      declarations: [
        ContactsComponent
      ],
      providers: [
        AlertService,
        AuthorizedDirective,
        EncryptionService,
        BusinessObjectDefinitionSubjectMatterExpertService,
        SubjectMatterExpertService,
        {
          provide: UserService,
          useClass: MockUser
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;

    component.namespace = 'TESTNAMESPACE';
    component.businessObjectDefinitionName = 'test_data_entity_name';
    component.contacts = [];

    businessObjectDefinitionSubjectMatterExpertApi = TestBed.get(BusinessObjectDefinitionSubjectMatterExpertService);
    spyOn(businessObjectDefinitionSubjectMatterExpertApi,
      'businessObjectDefinitionSubjectMatterExpertCreateBusinessObjectDefinitionSubjectMatterExpert')
      .and.returnValue(of({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      }
    }));
    spyOn(businessObjectDefinitionSubjectMatterExpertApi,
      'businessObjectDefinitionSubjectMatterExpertDeleteBusinessObjectDefinitionSubjectMatterExpert')
      .and.returnValue(of({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      }
    }));

    subjectMatterExpertApi = TestBed.get(SubjectMatterExpertService);
    spyOn(subjectMatterExpertApi, 'subjectMatterExpertGetSubjectMatterExpert')
      .and.returnValue(of({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      }
    }));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should mouse over show the edit options to the user', () => {
    const div = fixture.debugElement.nativeElement.querySelector('.contacts-content');
    const event = new Event('mouseenter');
    const simpleChange = new SimpleChange(null,
      [{
        contactDetails: {
          emailAddress: 'testemail@email.com'
        },
        subjectMatterExpertKey: {
          userId: 'test user'
        }
      }], false);
    component.ngOnChanges({contacts: simpleChange});
    component.onMouseEnter({});
    div.dispatchEvent(event);
    expect(component.hover).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.col-1').style.display).toBe('');
    component.onMouseLeave({});
    expect(component.hover).toBeFalsy();
  });

  it('should go to edit mode on click of the contact area', () => {
    // setting contacts null to test its working without a contact list
    component.contacts = null;
    const div = fixture.nativeElement.querySelector('.contacts-content');
    const event = new Event('click');
    div.dispatchEvent(event);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.card').style.display).toBe('');
  });

  it('should not go to edit mode if the user is not authorized', () => {

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.card').style.display).toBe('none');
  });

  it('should save the new user to database on click of save', () => {

    const content = fixture.nativeElement.querySelector('.contacts-content');
    const userInput = fixture.debugElement.query(By.css('input')).nativeElement;
    const saveButton = fixture.nativeElement.querySelector('.btn-primary');
    const editDoneButton = fixture.nativeElement.querySelector('.btn-outline-danger');
    const removeUserButton = fixture.nativeElement.querySelector('.close');
    const click = new Event('click');

    content.dispatchEvent(click);

    // saving blank user id is showing error
    expect(userInput.value).toBe('');
    userInput.dispatchEvent(new Event('input'));
    saveButton.dispatchEvent(click);
    userInput.value = 'test user';
    userInput.dispatchEvent(new Event('input'));
    saveButton.dispatchEvent(click);
    fixture.detectChanges();
    expect(fixture.componentInstance.userId).toBe('');  // after save user id removed from input field
    expect(fixture.componentInstance.validationError).toBe('');

    // delete the added user form the database
    // we cannot click on `x` and test as x link is created throught ng-bootstrap so we are directlu calling method
    fixture.componentInstance.remove({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      },
      subjectMatterExpertKey: {
        userId: 'test user'
      }
    });
    expect(fixture.componentInstance.displayingContacts.length).toBe(0);

    // edit done coming out of edit mode
    editDoneButton.dispatchEvent(click);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.card').style.display).toBe('none');
  });

  it('should show error when unable to show new user', () => {

    const content = fixture.nativeElement.querySelector('.contacts-content');
    const userInput = fixture.debugElement.query(By.css('input')).nativeElement;
    const saveButton = fixture.nativeElement.querySelector('.btn-primary');
    const editDoneButton = fixture.nativeElement.querySelector('.btn-outline-danger');
    const removeUserButton = fixture.nativeElement.querySelector('.close');
    const click = new Event('click');

    businessObjectDefinitionSubjectMatterExpertApi
      .businessObjectDefinitionSubjectMatterExpertCreateBusinessObjectDefinitionSubjectMatterExpert
      .and.returnValue(throwError({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      }
    }));

    businessObjectDefinitionSubjectMatterExpertApi
      .businessObjectDefinitionSubjectMatterExpertDeleteBusinessObjectDefinitionSubjectMatterExpert
      .and.returnValue(throwError({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      }
    }));

    content.dispatchEvent(click);

    // saving blank user id is showing error
    userInput.value = 'test user';
    userInput.dispatchEvent(new Event('input'));
    saveButton.dispatchEvent(click);
    fixture.detectChanges();
    expect(fixture.componentInstance.userId).toBe('test user');  // after save user id removed from input field
    expect(fixture.componentInstance.validationError).toBe('');

    subjectMatterExpertApi.subjectMatterExpertGetSubjectMatterExpert
      .and.returnValue(throwError({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      }
    }));
    userInput.value = 'test user';
    userInput.dispatchEvent(new Event('input'));
    saveButton.dispatchEvent(click);
    fixture.detectChanges();

    // delete the added user form the database
    fixture.componentInstance.remove({
      contactDetails: {
        emailAddress: 'testemail@email.com'
      },
      subjectMatterExpertKey: {
        userId: 'test user'
      }
    });
    expect(fixture.componentInstance.displayingContacts.length).toBe(0);
  });

});



