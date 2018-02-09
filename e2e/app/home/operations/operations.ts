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
 * Generates requests for posting to HERD
 * Utilizes the data specified in jsonSchema.js and data.js
 */

import data from './data';
import * as schema from '../../../util/JsonSchema';
/**
 * Generates requests for posting tag types and tags
 * @returns {{options: *[]}}
 */
export const postRequests = function () {
  // const root = path.resolve(__dirname).split('e2e')[0];
  // const schema = require(root+ "/util/JsonSchema.ts");
  // const data = require("./data");

  const tagTypePostUrl = new schema.TagType().postUrl();
  const tagPostUrl = new schema.Tags().postUrl();


  const setupOptions = {
    'options': [
      {
        'order': 1,
        'url': tagTypePostUrl,
        'body': new schema.TagType().postBody(data.tagTypeCode1().code, data.tagTypeCode1().displayName, data
          .tagTypeCode1().order, data.tagTypeCode1().description)
      },
      {
        'order': 2,
        'url': tagTypePostUrl,
        'body': new schema.TagType()
          .postBody(data.tagTypeCode2().code, data.tagTypeCode2().displayName, data.tagTypeCode2().order, data
            .tagTypeCode2().description)
      },
      {
        'order': 3,
        'url': tagTypePostUrl,
        'body': new schema.TagType()
          .postBody(data.tagTypeCode3().code, data.tagTypeCode3().displayName, data.tagTypeCode3().order, data.tagTypeCode3().description)
      },
      {
        'order': 4,
        'url': tagTypePostUrl,
        'body': new schema.TagType()
          .postBody(data.tagTypeCode4().code, data.tagTypeCode4().displayName, data.tagTypeCode4().order, data
            .tagTypeCode4().description)
      },
      {
        'order': 5,
        'url': tagTypePostUrl,
        'body': new schema.TagType()
          .postBody(data.tagTypeCode5().code, data.tagTypeCode5().displayName, data.tagTypeCode5().order, data
            .tagTypeCode5().description)
      },
      {
        'order': 6,
        'url': tagTypePostUrl,
        'body': new schema.TagType()
          .postBody(data.tagTypeCode6().code, data.tagTypeCode6().displayName, data.tagTypeCode6().order, data
            .tagTypeCode6().description)
      },
      {
        'order': 7,
        'url': tagPostUrl,
        'body': new schema.Tags()
          .postBodyWithoutParent(data.tagTypeCode1()
            .code, data.tagTypeCode1().tags[0].code, data.tagTypeCode1().tags[0].displayName, data.description)
      },
      {
        'order': 8,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithParent(data.tagTypeCode1()
          .code, data.tagTypeCode1().tags[1].code, data.tagTypeCode1().tags[1].displayName, data
          .description, data.tagTypeCode1().code, data.tagTypeCode1().tags[1].parentCode)
      },
      {
        'order': 9,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode1()
          .code, data.tagTypeCode1().tags[2].code, data.tagTypeCode1().tags[2].displayName, data.description)
      },
      {
        'order': 10,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode1().code, data.tagTypeCode1().tags[3].code, data
          .tagTypeCode1().tags[3].displayName, data.description)
      },
      {
        'order': 11,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode2().code, data.tagTypeCode2().tags[0]
          .code, data.tagTypeCode2().tags[0].displayName, data.description)
      },
      {
        'order': 12,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithParent(data.tagTypeCode2().code, data.tagTypeCode2().tags[1].code, data
            .tagTypeCode2().tags[1].displayName, data.description,
          data.tagTypeCode2().code, data.tagTypeCode2().tags[1].parentCode)
      },
      {
        'order': 13,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode2().code, data.tagTypeCode2().tags[2]
          .code, data.tagTypeCode2().tags[2].displayName, data.description)
      },
      {
        'order': 14,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode3().code, data.tagTypeCode3().tags[0].code, data
          .tagTypeCode3().tags[0].displayName, data.description)
      },
      {
        'order': 15,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode3().code, data.tagTypeCode3().tags[1].code, data
          .tagTypeCode3().tags[1].displayName, data.description)
      },
      {
        'order': 16,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode3().code, data.tagTypeCode3().tags[2].code, data
          .tagTypeCode3().tags[2].displayName, data.description)
      },
      {
        'order': 17,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithParent(data.tagTypeCode3().code, data.tagTypeCode3().tags[3].code, data
            .tagTypeCode3().tags[3].displayName, data.description,
          data.tagTypeCode3().code, data.tagTypeCode3().tags[3].parentCode)
      },
      {
        'order': 18,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithParent(data.tagTypeCode3().code, data.tagTypeCode3().tags[4].code, data
            .tagTypeCode3().tags[4].displayName, data.description,
          data.tagTypeCode3().code, data.tagTypeCode3().tags[4].parentCode)
      },
      {
        'order': 19,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode4().code, data.tagTypeCode4().tags[0].code, data
          .tagTypeCode4().tags[0].displayName, data.description)
      },
      {
        'order': 20,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode4().code, data.tagTypeCode4().tags[1].code, data
          .tagTypeCode4().tags[1].displayName, data.description)
      },
      {
        'order': 21,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode4().code, data.tagTypeCode4().tags[2].code, data
          .tagTypeCode4().tags[2].displayName, data.description)
      },
      {
        'order': 22,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode4().code, data.tagTypeCode4().tags[3].code, data
          .tagTypeCode4().tags[3].displayName, data.description)
      },
      {
        'order': 23,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[0].code, data
          .tagTypeCode5().tags[0].displayName, data.description)
      },
      {
        'order': 24,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[1].code, data
          .tagTypeCode5().tags[1].displayName, data.description)
      },
      {
        'order': 25,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[2].code, data
          .tagTypeCode5().tags[2].displayName, data.description)
      },
      {
        'order': 26,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[3].code, data
          .tagTypeCode5().tags[3].displayName, data.description)
      },
      {
        'order': 27,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[4].code, data
          .tagTypeCode5().tags[4].displayName, data.description)
      },
      {
        'order': 28,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[5].code, data
          .tagTypeCode5().tags[5].displayName, data.description)
      },
      {
        'order': 29,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode5().code, data.tagTypeCode5().tags[6].code, data
          .tagTypeCode5().tags[6].displayName, data.description)
      },
      {
        'order': 30,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode6().code, data.tagTypeCode6().tags[0].code, data
          .tagTypeCode6().tags[0].displayName, data.description)
      },
      {
        'order': 31,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode6().code, data.tagTypeCode6().tags[1].code, data
          .tagTypeCode6().tags[1].displayName, data.description)
      },
      {
        'order': 32,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode6().code, data.tagTypeCode6().tags[2].code, data
          .tagTypeCode6().tags[2].displayName, data.description)
      },
      {
        'order': 33,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode6().code, data.tagTypeCode6().tags[3].code, data
          .tagTypeCode6().tags[3].displayName, data.description)
      }
    ]
  }
  return setupOptions;
}


/**
 * Generates requests for deleting tag types and tags
 * @returns {{options: *[]}}
 */
export const deleteRequests = function () {
  const teardownOptions = {
    'options': [
      {
        'order': 1,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode1().code, data.tagTypeCode1().tags[0].code)
      },
      {
        'order': 2,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode1().code, data.tagTypeCode1().tags[1].code)
      },
      {
        'order': 3,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode1().code, data.tagTypeCode1().tags[2].code)
      },
      {
        'order': 4,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode1().code, data.tagTypeCode1().tags[3].code)
      },
      {
        'order': 5,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode2().code, data.tagTypeCode2().tags[0].code)
      },
      {
        'order': 6,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode2().code, data.tagTypeCode2().tags[1].code)
      },
      {
        'order': 7,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode2().code, data.tagTypeCode2().tags[2].code)
      },
      {
        'order': 8,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[0].code)
      },
      {
        'order': 9,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[1].code)
      },
      {
        'order': 10,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[2].code)
      },
      {
        'order': 10,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[3].code)
      },
      {
        'order': 10,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[4].code)
      },
      {
        'order': 11,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode4().code, data.tagTypeCode4().tags[0].code)
      },
      {
        'order': 11,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode4().code, data.tagTypeCode4().tags[1].code)
      },
      {
        'order': 11,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode4().code, data.tagTypeCode4().tags[2].code)
      },
      {
        'order': 11,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode4().code, data.tagTypeCode4().tags[3].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[0].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[1].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[2].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[3].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[4].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[5].code)
      },
      {
        'order': 12,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode5().code, data.tagTypeCode5().tags[6].code)
      },
      {
        'order': 13,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode6().code, data.tagTypeCode6().tags[0].code)
      },
      {
        'order': 13,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode6().code, data.tagTypeCode6().tags[1].code)
      },
      {
        'order': 13,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode6().code, data.tagTypeCode6().tags[2].code)
      },
      {
        'order': 13,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode6().code, data.tagTypeCode6().tags[3].code)
      },
      {
        'order': 14,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode1().code)
      },
      {
        'order': 15,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode2().code)
      },
      {
        'order': 16,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode3().code)
      },
      {
        'order': 17,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode4().code)
      },
      {
        'order': 18,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode5().code)
      },
      {
        'order': 19,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode6().code)
      }
    ]
  }

  return teardownOptions;
}

/*
* This method is used to remove association between tag and tag parent
* Only then tags can be deleted
*
*/
export const updateRequests = function () {
  const updateOptions = {
    'options': [{
      'order': 1,
      'url': new schema.Tags().deleteUrl(data.tagTypeCode1().code, data.tagTypeCode1().tags[1].code),
      'body': new schema.Tags().putBody(data.tagTypeCode1().code, data.tagTypeCode1().tags[1].code, data.tagTypeCode1()
        .tags[1].displayName, data.description)
    },
      {
        'order': 2,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode2().code, data.tagTypeCode2().tags[1].code),
        'body': new schema.Tags().putBody(data.tagTypeCode2().code, data.tagTypeCode2().tags[1].code, data
          .tagTypeCode2().tags[1].displayName, data.description)
      },
      {
        'order': 2,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[3].code),
        'body': new schema.Tags().putBody(data.tagTypeCode3().code, data.tagTypeCode3().tags[3].code, data
          .tagTypeCode3().tags[3].displayName, data.description)
      },
      {
        'order': 2,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[4].code),
        'body': new schema.Tags().putBody(data.tagTypeCode3().code, data.tagTypeCode3().tags[4].code, data.tagTypeCode3()
          .tags[4].displayName, data.description)
      }
    ]
  }

  return updateOptions;
}

export const initRequests = {
  posts: postRequests()
};

export const tearDownRequests = {
  updates: updateRequests(),
  deletes:  deleteRequests()
};
