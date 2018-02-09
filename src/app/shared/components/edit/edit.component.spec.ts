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

import { EditComponent } from './edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CKEditorModule } from 'ng2-ckeditor';
import { DebugElement } from '@angular/core';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  const initialValue = 'test input in the editor';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CKEditorModule
      ],
      declarations: [EditComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    component.text = initialValue;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display edit icon on mouse over', async(() => {
    const displayText = query('.row');

    expect(component.hover).toBe(false);
    expect(displayText.classes.edit).not.toBe(true);

    // by default isn't showing.
    expect(fixture.debugElement.query(By.css('i'))).toBeNull();

    displayText.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    expect(component.hover).toBe(true);
    expect(displayText.classes.edit).toBe(true);
    // shown on mouseover
    expect(query('i')).toBeDefined();

    displayText.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    expect(component.hover).toBe(false);
    expect(displayText.classes.edit).toBe(false);
    // no longer should be showing
    expect(query('i')).toBeNull();
  }));

  it('should display editor when clicked and not in edit mode', () => {
    spyOn(component, 'enterEdit').and.callThrough();
    // initiate edit mode
    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.enterEdit).toHaveBeenCalled();
    expect(component.hover).toBe(false);
    expect(component.editMode).toBe(true);
    // should hide default display text
    expect(query('.row')).toBeNull();
    expect(query('.editor-form')).not.toBeNull();
  });

  // tests shareIcon method for both the icon itself and the wrapper row
  it('should not display editor when mousedover / clicked and disableEdit is true', () => {
    component.disableEdit = true;
    spyOn(component, 'enterEdit').and.callThrough();
    // initiate edit mode
    query('.row').triggerEventHandler('mouseenter', null);
    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(query('.row').classes.edit).toBe(false);
    expect(component.enterEdit).toHaveBeenCalled();
    expect(component.editMode).toBe(false);
    // row should still be shown
    expect(query('.row')).not.toBeNull();
    expect(query('.editor-form')).toBeNull();
  });

  it('should emit form data on submit and hide editor on submit', () => {
    // tests that value is emitted
    component.editDone.subscribe((x) => {
      expect(x.text).toBe('test new value');
    });
    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();

    component.editForm.setValue({ text: 'test new value' });

    query('.editor-form .btn-primary').nativeElement.click();
    fixture.detectChanges();

    expect(query('.row')).not.toBeNull();
    // does not update the value immediately.  only updates display value when parent pushes a new value.
    expect(query('.row').nativeElement.innerText).toBe(initialValue);
    expect(query('.editor-form')).toBeNull();

    component.text = 'test new value';
    fixture.detectChanges();
    expect(query('.row').nativeElement.innerText).toBe('test new value');
  });

  it('should use ckeditor for complex edits', async(() => {
    // default is to use ckeditor
    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();
    const ck = query('ckeditor');
    // can't verify value from the view as the ckeditor in tests loads outside the testing scope.
    expect(ck).not.toBeNull();
    expect(query('input')).toBeNull();
  }));

  it('should use input for simple edits ', () => {
    component.simpleEdit = true;
    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(query('ckeditor')).toBeNull();
    const simpleInput = query('input');
    expect(simpleInput).not.toBeNull();
    expect(simpleInput.nativeElement.value).toBe(initialValue);
  });

  // this spec tests editValidator and containsIlleagalCharacters functions
  // as well as the bindings for vaalidation in the template
  it('should not emit form data on submit when validation fails', () => {
    component.required = true;

    spyOn(component.editDone, 'emit').and.callThrough();

    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();

    component.editForm.setValue({ text: '' });

    query('.editor-form .btn-primary').nativeElement.click();
    fixture.detectChanges();

    expect(query('.row')).toBeNull();
    expect(query('.editor-form')).not.toBeNull();
    expect(component.editDone.emit).not.toHaveBeenCalled();
    let expectedMesage = 'Must supply a value for this field';
    let expectedErrors: any = {
      'valueRequired': expectedMesage
    };
    expect(component.editForm.errors).toEqual(expectedErrors);
    expect(query('.form-errors small').nativeElement.innerText).toEqual(expectedMesage);

    component.illegalCharacters = ['-', '?'];
    component.editForm.setValue({ text: '-test?@' });
    query('.editor-form .btn-primary').nativeElement.click();
    fixture.detectChanges();
    expect(query('.row')).toBeNull();
    expect(query('.editor-form')).not.toBeNull();
    expect(component.editDone.emit).not.toHaveBeenCalled();
    expectedMesage = 'This field contains illegal character(s). Characters not allowed: '  +
    component.illegalCharacters.join(' , ');
    expectedErrors = {
      'illegalCharacters': expectedMesage
    };
    expect(component.editForm.errors).toEqual(expectedErrors);
    expect(query('.form-errors small').nativeElement.innerText).toEqual(expectedMesage);

  });

  it('should close editor when cancel button is clicked in edit mode', () => {
    component.simpleEdit = true;

    spyOn(component, 'closeEditor').and.callThrough();

    query('.row').triggerEventHandler('click', null);
    fixture.detectChanges();

    component.editForm.setValue({ text: 'random new value'});
    query('.editor-form .btn-danger').nativeElement.click();
    fixture.detectChanges();
    expect(query('.row')).not.toBeNull();
    expect(query('.editor-form')).toBeNull();
    expect(query('.col').nativeElement.innerText).toEqual(initialValue);
    expect(component.closeEditor).toHaveBeenCalled();
  });
  function query(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});

