<!---
 Copyright 2018 herd-ui contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

# Herd-UI

Herd-UI is frontend for [Herd](https://github.com/FINRAOS/herd) and can be configured to point to any compatible Herd instance. It is developed using Angular-CLI, Angular, Bootstrap 4, and TypeScript.

### Angular CLI

Herd-UI uses [Angular CLI](https://github.com/angular/angular-cli) version 1.6.x for local development. To get more help on the Angular CLI use `ng help` or check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

###### Development server

While developing in your local machine you can run `ng serve` for a dev server and then navigate to `http://localhost:4200/` to see Herd-UI running in your local machine. The app will automatically reload if you change any of the source files.

###### Code Scaffolding

Angular cli gives us the capability of generating new components, directives, pipes, etc. through command prompt
you can simply run `ng generate component component-name` to generate a new component.
You can also use `ng generate directive/pipe/service/class/module`.

###### Build

To build, test and run the project, there any many `npm` s configured in package.json. You can run those commands to develop, test and deploy code into server.

 The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. and then you can configure your CI to place your build code in to your server.
 
###### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

###### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve` or point to any deployed server.

These are currently not setup to run in an Open Source context but we will iterate over the test configuration to make sure we have this in the future.

#### Further help

FINRA data management team is currently developing, supporting and enhancing the Herd-UI project. You can raise a bug or feature in the github issue page or contact team for specific features or bugs.


