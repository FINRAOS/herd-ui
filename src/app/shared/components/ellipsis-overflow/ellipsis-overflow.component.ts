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
import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sd-ellipsis-overflow',
  templateUrl: './ellipsis-overflow.component.html',
  styleUrls: ['./ellipsis-overflow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EllipsisOverflowComponent implements AfterViewInit {


  @Input() public ellipsisContent;
  @Input() public tooltipDirection;
  @ViewChild(NgbTooltip) public tooltip: NgbTooltip;
  private isEllipisOverflow;
  private div;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.div = this.elementRef.nativeElement.getElementsByClassName('ellipsis-overflow')[0];
  }

  enableTooltip() {
    // tolerance of -3 due to IE offsetWidth issues
    if (this.div.clientWidth < this.div.scrollWidth - 3) {
      this.tooltip.ngbTooltip = this.div.innerText;
      this.tooltip.open();
    }
  }

  disableTooltip() {
    this.tooltip.close();
  }

}
