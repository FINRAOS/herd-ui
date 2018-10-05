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
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es7/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
import 'classlist.js'; // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following to support `@angular/animation`. */
import 'web-animations-js'; // Run `npm install --save web-animations-js`.
/** Evergreen browsers require these. **/
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone'; // Included with Angular CLI.
// used to programmatically set the configuration of the ckeditor file imports
// Note: this must stay as an import due to all of the importans happening before a statement is run
// no matter where the statement is in this file.
import './ckset';
// needed for our in place editing features
import 'ckeditor';


/** ALL Firefox browsers require the following to support `@angular/animation`. **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */

// TODO: Below polyfills added in angular 2-5. Not required after angular 6 migration. can be removed after 4-5 months fro today (Aug2018)
/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// Angular global import issue. migration to 6/7 interduced this issue. specially while going to data object list page router shows error
(window as any).global = window;
// import 'intl';  // Run `npm install --save intl`.
// import 'intl/locale-data/jsonp/en-US.js'; // need for OS X 10.11 safari 9.0
