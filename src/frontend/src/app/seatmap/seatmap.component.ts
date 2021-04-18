import {Component, Input, OnInit} from '@angular/core';

import {ISeat, Metric, OptSeat, Seat} from '../seatmap';

@Component({
  selector: 'app-seatmap',
  templateUrl: './seatmap.component.html',
  styleUrls: ['./seatmap.component.scss']
})

export class SeatmapComponent implements OnInit {
  map: OptSeat[][] = [];
  json: object[] = [];
  @Input() rowMetric: Metric = new Metric();
  @Input() colMetric: Metric = new Metric();

  constructor() { }

  ngOnInit(): void {
  }

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
  }
}
