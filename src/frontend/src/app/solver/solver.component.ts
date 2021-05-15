import {AfterViewInit, Component, ElementRef, NgZone, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';

import { ILayout, Layout } from '../_dtos/layout';
import { Solver } from '../_dtos/solver';

import { LayoutService } from '../_services/layout.service';
import { SolverService } from '../_services/solver.service';
import {fabric} from 'fabric';
import {FabricService} from '../_services/fabric.service';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit, AfterViewInit {
  canvasId = 'designer-canvas';
  layouts: ILayout[] = [];
  solvers: Solver[] = [];

  selectedSolver: Solver | null = null;
  selectedLayout: ILayout | null = null;

  constructor(
      private layoutService: LayoutService,
      private solverService: SolverService,
      private fabricService: FabricService,
      private elementRef: ElementRef,
      private ngZone: NgZone
  ) {
    this.layoutService.getLayouts()
        .pipe(map(data => data.map((layout: ILayout) => new Layout(layout))))
        .subscribe(layouts => this.layouts = layouts);
    this.solverService.getSolvers()
        .subscribe(solvers => this.solvers = solvers);

    /*
    this.solvers = [
        new Solver(1, "Backtracking", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n"),
        new Solver(2, "Algorithm 1", "desc 1"),
        new Solver(3, "Algorithm 2", "desc 2"),
    ];

    this.seatLayouts = [
      new SeatLayout(1, "Layout 1", [], "assets/thumbnails/sample.png"),
      new SeatLayout(2, "Layout 2", [], "assets/thumbnails/sample.png"),
      new SeatLayout(3, "Layout 3", [], "assets/thumbnails/sample.png"),
      new SeatLayout(4, "Layout 4", [], "assets/thumbnails/sample.png"),
      new SeatLayout(5, "Layout 5", [], "assets/thumbnails/sample.png"),
    ];
    */
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular( () => {
      this.fabricService.setCanvas(new fabric.Canvas(this.canvasId, {
        imageSmoothingEnabled: false,
        backgroundColor: '#fff',
        renderOnAddRemove: false,
        selection: false
      }), true);
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
  }

  solve(): void {
    if (this.selectedLayout === null) {
      return;
    }
    if (this.selectedSolver === null) {
      return;
    }
    this.solverService.solve(this.selectedSolver.id, {
      layout_id: this.selectedLayout.id
    }).subscribe(data => {
      console.log('Solve-placeholder', data);
      // this.fabricService.loadLayout(layout);
    });
  }

  onLayoutChange(): void {
    if (this.selectedLayout) {
      this.fabricService.loadLayout(this.selectedLayout);
    }
  }
}
