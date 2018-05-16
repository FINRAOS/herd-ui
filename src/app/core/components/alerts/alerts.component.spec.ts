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
import { async, inject, ComponentFixture, TestBed, tick, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { AlertsComponent } from './alerts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Alert, AlertService, SuccessAlert } from 'app/core/services/alert.service';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
      ],
      providers: [
        AlertService
      ],
      declarations: [AlertsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should listen to AlertService for alerts', inject([AlertService], (alerter: AlertService) => {
    const alert = new SuccessAlert('Success Title', 'Success Subtitle', 'success text');
    alerter.alert(alert);
    fixture.detectChanges();
    const alerts = fixture.debugElement.queryAll(By.css('.sd-alerts ngb-alert'));
    expect(alerts.length).toBe(1);
    expect(alerts[0].query(By.css('h4')).nativeElement.textContent).toContain('Success Title');
    expect(alerts[0].query(By.css('h6')).nativeElement.textContent).toContain('Success Subtitle');
    expect(alerts[0].query(By.css('p')).nativeElement.textContent).toContain('success text');
  }));

  it('should closeAlert after delayTime', fakeAsync(inject([AlertService], (alerter: AlertService) => {
    const alert = new SuccessAlert('Success Title', 'Success Subtitle', 'success text');
    spyOn(component, 'closeAlert').and.callThrough();
    alerter.alert(alert);
    tick();
    fixture.detectChanges();

    let alerts = fixture.debugElement.queryAll(By.css('.sd-alerts ngb-alert'));
    expect(alerts.length).toBe(1);
    expect(alerts[0].query(By.css('h4')).nativeElement.textContent).toContain('Success Title');
    expect(alerts[0].query(By.css('h6')).nativeElement.textContent).toContain('Success Subtitle');
    expect(alerts[0].query(By.css('p')).nativeElement.textContent).toContain('success text');

    tick(component.delay / 2);
    // should still be there
    alerts = fixture.debugElement.queryAll(By.css('.sd-alerts ngb-alert'));
    expect(alerts.length).toBe(1);

    tick(component.delay / 2);

    fixture.detectChanges();
    // should no longer be there
    alerts = fixture.debugElement.queryAll(By.css('.sd-alerts ngb-alert'));
    expect(alerts.length).toBe(0);
    expect(component.closeAlert).toHaveBeenCalledWith(alert);
  })));

});
