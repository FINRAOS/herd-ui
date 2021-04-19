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
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'sd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loading = false;
  public loginForm: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;
  public returnUrl: string;

  constructor(private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private currentUserService: UserService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];

  }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.currentUserService.getCurrentUser(this.loginForm.value.username, this.loginForm.value.password)
        .pipe(finalize(() => {
          this.loading = false;
        })).subscribe((response) => {
        // navigate by url is used due to the fact that the returnUrl may have optional params which need to be parsed.
        // same is true for query params
        this.router.navigateByUrl(this.returnUrl, {replaceUrl: true});
      }, (error) => {
        this.alertService.alert({
          title: 'Login failure!',
          subTitle: 'Unable to login! Please try again or contact support team.',
          text: error,
          type: 'danger'
        });
      });
    }
  }

}
