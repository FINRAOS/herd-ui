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

(function () {
  var fs = require('fs');
  var glob = require('glob-fs')();
  var path = require('path');
  var result = 0;
  var exclude = ['LICENSE', path.join('src', 'favicon.ico')];
  var files = [];
  files = glob.readdirSync('**');
  files.map((file) => {
    try {
      if (!fs.lstatSync(file).isDirectory() && file.indexOf('.json') === -1 && exclude.indexOf(file) === -1) {
        var data = fs.readFileSync(file, 'utf8');

        if (data.indexOf('Copyright 2018 herd-ui contributors') === -1) {
          console.log('Please add License text in coment in the file ' + file);
          result = 1;
        }
      }
    } catch (e) {
      console.log('Error:', e.stack);
    }
  });
  process.exit(result);
})();

