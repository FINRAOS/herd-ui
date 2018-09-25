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
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessObjectDefinitionKey } from '@herd/angular-client';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
    selector: 'sd-data-entity-list',
    templateUrl: './data-entity-list.component.html',
    styleUrls: ['./data-entity-list.component.scss']
})
export class DataEntityListComponent implements OnInit {
    public dataEntities: BusinessObjectDefinitionKey[];
    public searchTerm: string;
    public total: number;
    public searchInput: HTMLInputElement;
    private previousTime: Subscription;

    constructor(private route: ActivatedRoute, private router: Router, private e: ElementRef) {
        this.searchTerm = '';
        this.dataEntities = [];
    }

    ngOnInit() {

        this.searchInput = this.e.nativeElement.getElementsByTagName('input')[0];
        this.route.data.subscribe((data) => {
            this.dataEntities = data.resolvedData.dataEntities;
            this.total = data.resolvedData.total;
            this.searchInput.focus();
        });

        this.route.queryParams.subscribe((params) => {
            // set the search term to a default value if we don't have one
            this.searchTerm = this.searchTerm || params.searchTerm || '';
            this.searchInput.focus();
        });

        fromEvent(this.searchInput, 'keyup')
          .pipe(
            map((i: any) => i.currentTarget.value),
            debounceTime(500)
          )
          .subscribe((val) => {
                this.router.navigate(['/data-entities'],
                    {
                        queryParams: {
                            searchTerm: val
                        },
                        replaceUrl: true
                    });
            });
    }

}
