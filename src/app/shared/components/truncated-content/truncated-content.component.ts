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
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'sd-truncated-content',
  templateUrl: './truncated-content.component.html',
  styleUrls: ['./truncated-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruncatedContentComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() showLines: number;
  @Input() content: string;
  @Input() readMoreText: string;
  @Input() showLessText: string;
  @Input() lastLineRatio = 0;
  @ViewChild('truncatedWrapper') wrapper: ElementRef & HTMLElement;
  @ViewChild('truncatedContent') private contentElement: ElementRef & HTMLElement;
  @ViewChild('toggleContent') toggle: ElementRef & HTMLElement;
  baseLines: string;
  contentStyles: CSSStyleDeclaration;

  ngOnInit() {
    this.readMoreText = this.readMoreText ? this.readMoreText : '';
    this.showLessText = this.showLessText ? this.showLessText : '';
    this.showLines = !isNaN(this.showLines) && this.showLines > - 1 ? this.showLines : 1;
  }

  ngAfterViewInit(): void {
    // @ViewChild creates Element refs.  to work directly on them we need the native element
    // of each
    this.wrapper = this.wrapper.nativeElement;
    this.contentElement = this.contentElement.nativeElement;
    this.toggle = this.toggle.nativeElement;
    this.contentStyles = window.getComputedStyle(this.contentElement);
  }

  // calculates whether or not to show the toggle bar.
  ngAfterViewChecked(): void {
    this.baseLines = Math.round((this.showLines - this.lastLineRatio) * parseFloat(this.contentStyles.lineHeight)) + 'px';
    const roundedNumber = Math.round(parseFloat(this.contentStyles.height) / parseFloat(this.contentStyles.lineHeight));
    if (roundedNumber <= this.showLines) {
      this.toggle.classList.add('hide');
    } else {
      this.toggle.classList.remove('hide');
      this.wrapper.style.maxHeight = this.wrapper.style.maxHeight ? this.wrapper.style.maxHeight : this.baseLines;
    }
  }

  // changes the height of the component wrapper to fit the data base don toggle status
  processToggle() {
    // this means we are in base state of not showing all the content
    if (this.wrapper.style.maxHeight && parseFloat(this.wrapper.style.maxHeight) <= parseFloat(this.baseLines)) {
      this.showMore();
    } else {
      this.showLess();
    }
  }

  showMore() {
    this.toggle.classList.add('less');
    this.toggle.innerText = this.showLessText;
    this.wrapper.style.maxHeight = parseFloat(this.contentStyles.height) +
      parseFloat(this.contentStyles.marginTop) + parseFloat(this.contentStyles.marginBottom) + 'px';
  }

  showLess() {
    this.toggle.classList.remove('less');
    this.wrapper.style.maxHeight = this.baseLines;
    this.toggle.innerText = this.readMoreText;
  }

}


