import {
  AfterViewInit,
  Component, ElementRef, HostListener,
  Input, NgZone,
  OnInit,
} from '@angular/core';

import { LayoutService} from '../_services/layout.service';

import { Metric, OptSeat } from '../_dtos/seatmap';
import {FabricService} from '../_services/fabric.service';
import {fabric} from 'fabric';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit, AfterViewInit{
  canvasId = 'designer-canvas';
  map: OptSeat[][] = [];
  name = '';
  json: object[] = [];
  @Input() rowMetric: Metric = new Metric();
  @Input() colMetric: Metric = new Metric();
  @Input() snapToGrid = true;

  constructor(private layoutService: LayoutService, private fabricService: FabricService,
              private ngZone: NgZone, private elementRef: ElementRef) {
    document.body.style.overflowY = 'hidden';
  }

  ngOnInit(): void
  {}

  ngAfterViewInit(): void {
    this.fabricService.Canvas = new fabric.Canvas(this.canvasId, {
      imageSmoothingEnabled: false,
      backgroundColor: '#fff',
      renderOnAddRemove: false,
      selectionColor: 'rgba(116, 185, 255, 0.1)',
      selectionBorderColor: 'rgba(6, 89, 153, 0.7)',
      selectionLineWidth: 1.5,
      selectionDashArray: [10, 5],
      notAllowedCursor: 'default'
    });
    this.fabricService.Width = 1500;
    this.fabricService.Height = 857;

    this.elementRef.nativeElement.querySelector('.canvas-container')
      .addEventListener('wheel', (event: WheelEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onScroll(event);
        });
      });

    this.elementRef.nativeElement.querySelector('.canvas-container')
      .addEventListener('mousedown', (event: MouseEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onMouseDown(event);
        });
      });

    this.elementRef.nativeElement.querySelector('.canvas-container')
      .addEventListener('mousemove', (event: MouseEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onMouseMove(event);
        });
      });

    window
      .addEventListener('mouseup', (event: MouseEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onMouseUp(event);
        });
      });

    this.elementRef.nativeElement.querySelector('.canvas-container')
      .addEventListener('mouseover', (event: MouseEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onMouseOver(event);
        });
      });

    this.elementRef.nativeElement.querySelector('.canvas-container')
      .addEventListener('mouseleave', (event: MouseEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onMouseLeave(event);
        });
      });

    window
      .addEventListener('keydown', (event: KeyboardEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onKeyDown(event);
        });
      });

    window
      .addEventListener('keyup', (event: KeyboardEvent) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.onKeyUp(event);
        });
      });

    this.fabricService.drawGrid();
  }

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

  generateSeats(): void {
    this.fabricService.generateSeats(this.rowMetric.count, this.colMetric.count, this.colMetric.distance, this.rowMetric.distance, 40);
  }

  toggleSnapToGrid(): void {
    console.log(this.snapToGrid);
    this.fabricService.SnapToGrid = this.snapToGrid;
  }
}
