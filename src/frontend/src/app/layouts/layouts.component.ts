import { Component, OnInit } from '@angular/core';
import { Layout } from '../layout';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {

  layouts: Layout[] = []
  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.layoutService.getLayouts()
        .subscribe(layouts => this.layouts = layouts)
  }

}
