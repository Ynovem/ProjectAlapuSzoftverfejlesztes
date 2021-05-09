import { Component, OnInit } from '@angular/core';

import { map } from "rxjs/operators";

import { ILayout, LayoutDisplay } from '../_dtos/layout';
import { LayoutService } from '../_services/layout.service';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {
  layouts: LayoutDisplay[] = []

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.layoutService.getLayouts()
        .pipe(map(data => data.map((layout: ILayout) => new LayoutDisplay(layout))))
        .subscribe(layouts => this.layouts = layouts)
  }

}
