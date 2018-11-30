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
import { StorageUnitsComponent } from './storage-units.component';
import { Attribute, CurrentUserService, StorageUnit, UserAuthorizations } from '@herd/angular-client';
import { By } from '@angular/platform-browser';
import { AuthorizedDirective } from '../../../shared/directive/authorized/authorized.directive';
import { UserService } from '../../../core/services/user.service';
import { click } from '../../../shared/utils/click-helper';
import { of } from 'rxjs/internal/observable/of';

describe('StorageUnitsComponent', () => {
  let component: StorageUnitsComponent;
  let fixture: ComponentFixture<StorageUnitsComponent>;

  const bucketAttr: Attribute = {
    name: 'bucket.name',
    value: 'test-bucket-name'
  };
  const jdbcUrlAttr: Attribute = {
    name: 'jdbc.url',
    value: 'jdbc://testurl'
  };
  const jdbcUserCredNameAttr: Attribute = {
    name: 'jdbc.user.credential.name',
    value: 'jdbcUserCredentialName'
  };
  const jdbcUserNameAttr: Attribute = {
    name: 'jdbc.username',
    value: ''
  };
  const randomAttr: Attribute = {
    name: 'random.attr.should.not.show',
    value: 'show not show'
  };


  const storageUnits: StorageUnit[] = [
    {
      restoreExpirationOn: new Date(),
      storageUnitStatus: 'ENABLED',
      storage: {
        name: 'Super Storage',
        storagePlatformName: 'RDS3_Hybrid',
        attributes: [
          bucketAttr,
          jdbcUrlAttr,
          jdbcUserCredNameAttr,
          jdbcUserNameAttr,
          randomAttr
        ]
      },
      storageDirectory: {
        directoryPath: 'the/test/path'
      },
      storageFiles: [
        {
          filePath: 'protractorTest/randomfilepath/somefile.txt',
          fileSizeBytes: 524,
          rowCount: 1
        }
      ]
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StorageUnitsComponent,
        AuthorizedDirective
      ],
      providers: [
        UserService,
        CurrentUserService,
        {
          provide: UserService,
          useValue: {
            user: of({
              userId: 'test_user'
            } as UserAuthorizations)
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageUnitsComponent);
    component = fixture.componentInstance;
    component.namespace = 'testnamesoace';
    component.storageUnits = storageUnits;
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  // TODO: Add checking for storageUnitStatus / Files sections
  it('should show proper storage unit details', () => {
    // Note: the way data is registered generally they won't all be showing at once
    // this is just to prove that if they exist they will show
    const storageUnitAttributesRoot = fixture.debugElement.query(By.css('.columns-detail .col-6')).nativeElement;
    // all of the elements should be showing
    expect(storageUnitAttributesRoot.textContent).toContain(bucketAttr.name);
    expect(storageUnitAttributesRoot.textContent).toContain(bucketAttr.value);
    expect(storageUnitAttributesRoot.textContent).toContain(jdbcUserCredNameAttr.name);
    expect(storageUnitAttributesRoot.textContent).toContain(jdbcUserCredNameAttr.value);

    // in this case there is no value.  this is just a check to make sure that doesn't break anything.
    expect(storageUnitAttributesRoot.textContent).toContain(jdbcUserNameAttr.name);
    expect(storageUnitAttributesRoot.textContent).toContain(jdbcUserNameAttr.value);

    expect(storageUnitAttributesRoot.textContent).toContain(jdbcUrlAttr.name);
    expect(storageUnitAttributesRoot.textContent).toContain(jdbcUrlAttr.value);
    // this should not be showing as it is not a defined attribute to show
    expect(storageUnitAttributesRoot.textContent).not.toContain(randomAttr.name);
    expect(storageUnitAttributesRoot.textContent).not.toContain(randomAttr.value);

    // Verifying file is present and on click
    const fileSection = fixture.debugElement.query(By.css('.files-loop')).nativeElement;
    expect(fileSection.textContent).toContain(storageUnits[0].storageFiles[0].filePath);
    expect(fileSection.textContent).toContain('0.51 kB');  // 524 converted to kb

    // click the download files button to test its exist and clickable
    click(fixture.debugElement.query(By.css('.btn-link')));

  });

  it('should show message when no storage units exist', () => {
    component.storageUnits = null;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('No storage-units registered.');

    component.storageUnits = [];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('No storage-units registered.');
  });
});
