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
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable()
export class EncryptionService {

  constructor() {
  }


  public encryptAndGet(userId: string) {

    // Pads a given string with whitespace to make it 16 chars. long
    const padString = function (source) {
      const paddingChar = ' ';
      const size = 16;
      const padLength = size - source.length;

      for (let i = 0; i < padLength; i++) {
        source += paddingChar;
      }

      return source;
    };

    // Get key and IV from configuration
    const key = CryptoJS.enc.Hex.parse(environment.bs.beastEndpointUrl);
    const iv = CryptoJS.enc.Hex.parse(environment.bs.beastAgs);

    // Get padded value
    const padMsg = padString(userId);

    // Encrypt with a constant IV to always get a deterministic output
    const encrypted = CryptoJS.AES.encrypt(
      padMsg,
      key,
      {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }
    );

    // return the cipher-text
    return encrypted.toString();
  }

}
