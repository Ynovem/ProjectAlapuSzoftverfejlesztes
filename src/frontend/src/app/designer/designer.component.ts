import {
  AfterViewInit,
  Component, ElementRef,
  Input, NgZone,
  OnInit,
} from '@angular/core';

import { LayoutService} from '../_services/layout.service';

import { Metric, OptSeat } from '../_dtos/seatmap';
import {FabricService} from '../_services/fabric.service';
import {fabric} from 'fabric';
import {Layout} from '../_dtos/layout';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit, AfterViewInit{
  canvasId = 'designer-canvas';
  generateAlertClosed = true;
  map: OptSeat[][] = [];
  name = '';
  json: object[] = [];
  @Input() rowMetric: Metric = new Metric();
  @Input() colMetric: Metric = new Metric();
  @Input() snapToGrid = true;

  constructor(private layoutService: LayoutService, private fabricService: FabricService,
              private ngZone: NgZone, private elementRef: ElementRef) {
  }

  ngOnInit(): void
  {
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular( () => {
      this.fabricService.setCanvas(new fabric.Canvas(this.canvasId, {
        imageSmoothingEnabled: false,
        backgroundColor: '#fff',
        renderOnAddRemove: false,
        selectionColor: 'rgba(116, 185, 255, 0.1)',
        selectionBorderColor: 'rgba(6, 89, 153, 0.7)',
        selectionLineWidth: 1.5,
        selectionDashArray: [10, 5],
        notAllowedCursor: 'default'
      }), false);
    });
    this.fabricService.Width = 1500;
    this.fabricService.Height = 857;

    this.fabricService.drawGrid();

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

    window
      .addEventListener('copy', (event: Event) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.Copy();
        });
      });

    window
      .addEventListener('paste', (event: Event) => {
        this.ngZone.runOutsideAngular( () => {
          this.fabricService.Paste();
        });
      });
  }

  generateSeats(): void {
    const success = this.fabricService.generateSeats(this.rowMetric.count, this.colMetric.count,
                    this.colMetric.distance, this.rowMetric.distance, 40);
    if (!success){
      this.generateAlertClosed = false;
    }
  }

  toggleSnapToGrid(): void {
    this.fabricService.SnapToGrid = this.snapToGrid;
  }

  saveLayout(): void {
    const savableLayout: Layout = this.fabricService.saveLayout(this.name);
    // savableLayout.coords = JSON.stringify(savableLayout.coords);
    this.layoutService.saveLayout(savableLayout).subscribe(data => {
      console.log(data);
      this.fabricService.clear(true);
    });
  }

  resetCanvas(): void {
    this.fabricService.clear(true);
  }

  addSeat(): void{
    this.fabricService.addSeat();
  }
}
