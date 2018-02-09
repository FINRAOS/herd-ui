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
import { by, element, ElementFinder, browser, ElementArrayFinder, protractor } from 'protractor';
import { BasePo } from '../base/base.po';
const conf = require('../../config/conf.e2e.json');

export class LoginPage {
    loginForm: ElementFinder = element(by.css('sd-login .card-block'));
    username: ElementFinder = this.loginForm.all(by.tagName('input')).get(0);
    password: ElementFinder = this.loginForm.all(by.tagName('input')).get(1);
    loginButton: ElementFinder = this.loginForm.element(by.css('.btn-success'));
    async login(name: string = conf.loginUser, pwd: string = conf.loginPwd) {
        await this.username.sendKeys(name);
        await this.password.sendKeys(pwd);
        await this.loginButton.click();
        return browser.wait(protractor.ExpectedConditions.not(protractor.ExpectedConditions.urlContains('returnUrl')));
    }
}
