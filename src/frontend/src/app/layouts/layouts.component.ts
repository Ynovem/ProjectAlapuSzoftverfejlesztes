import { Component, OnInit } from '@angular/core';

import { map } from "rxjs/operators";

import { Layout, LayoutDisplay } from '../layout';
import { LayoutService } from '../layout.service';

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
        .pipe(map(data => data.map((layout: Layout) => new LayoutDisplay(layout))))
        .subscribe(layouts => this.layouts = layouts)
  }

}
