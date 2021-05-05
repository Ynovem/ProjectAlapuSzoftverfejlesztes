import { Component, Input } from '@angular/core';

import {LayoutService} from "../layout.service";

import {ISeat, Metric, OptSeat, Seat} from '../seatmap';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent {
  map: OptSeat[][] = [];
  name: string = "";
  json: object[] = [];
  @Input() rowMetric: Metric = new Metric();
  @Input() colMetric: Metric = new Metric();

  constructor(private layoutService: LayoutService) { }

  public generateSeatMap() {
    let map: OptSeat[][] = [];

    for (let r=0; r<this.rowMetric.count; r++) {
      let row: OptSeat[] = [];

      for (let c=0; c<this.colMetric.count; c++) {
        row.push(new OptSeat(r*this.rowMetric.distance, c*this.colMetric.distance));
      }

      map.push(row);
    }

    this.map = map;
  }

  public toggleSeat(seat: OptSeat) {
    seat.disabled = !seat.disabled;
  }

  public getSeatDots() {
    let json = [];
    for (let r=0; r<this.rowMetric.count; r++) {
      for (let c=0; c<this.colMetric.count; c++) {
        const seat = this.map[r][c];
        if (seat.disabled) {
          continue;
        }
        json.push(seat.toJson());
      }
    }

    this.json = json;
    const body = {
      'name': this.name,
      'coords': JSON.stringify(json),
    };
    this.layoutService.saveLayout(body).subscribe(data => {
      console.log("[Debug] Data:", data);
    });
  }
}
