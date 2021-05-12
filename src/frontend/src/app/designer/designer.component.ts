import {Component, Directive, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

import { LayoutService} from '../_services/layout.service';

import { Metric, OptSeat } from '../_dtos/seatmap';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit{
  map: OptSeat[][] = [];
  name = '';
  json: object[] = [];
  @Input() rowMetric: Metric = new Metric();
  @Input() colMetric: Metric = new Metric();

  constructor(private layoutService: LayoutService) {
    document.body.style.overflowY = 'hidden';
  }

  ngOnInit(): void
  {}

  public generateSeatMap(): void {
    const map: OptSeat[][] = [];

    for (let r = 0; r < this.rowMetric.count; r++) {
      const row: OptSeat[] = [];

      for (let c = 0; c < this.colMetric.count; c++) {
        row.push(new OptSeat(r * this.rowMetric.distance, c * this.colMetric.distance));
      }

      map.push(row);
    }

    this.map = map;
  }

  public toggleSeat(seat: OptSeat): void {
    seat.disabled = !seat.disabled;
  }

  public getSeatDots(): void {
    const json = [];
    for (let r = 0; r < this.rowMetric.count; r++) {
      for (let c = 0; c < this.colMetric.count; c++) {
        const seat = this.map[r][c];
        if (seat.disabled) {
          continue;
        }
        json.push(seat.toJson());
      }
    }

    this.json = json;
    const body = {
      name: this.name,
      coords: JSON.stringify(json),
    };
    this.layoutService.saveLayout(body).subscribe(data => {
      console.log('[Debug] Data:', data);
    });
  }
}
