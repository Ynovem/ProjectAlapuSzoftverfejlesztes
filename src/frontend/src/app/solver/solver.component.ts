import {AfterViewInit, Component, ElementRef, NgZone, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';

import { IRule, Rule } from '../_dtos/rule';
import { ILayout, Layout } from '../_dtos/layout';
import { Solver } from '../_dtos/solver';

import { RuleService } from '../_services/rule.service';
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
  rules: IRule[] = [];
  layouts: ILayout[] = [];
  solvers: Solver[] = [];

  selectedRule: IRule | null = null;
  selectedSolver: Solver | null = null;
  selectedLayout: ILayout | null = null;

  constructor(
      private ruleService: RuleService,
      private layoutService: LayoutService,
      private solverService: SolverService,
      private fabricService: FabricService,
      private elementRef: ElementRef,
      private ngZone: NgZone
  ) {
    this.ruleService.getRules()
        .subscribe(rules => this.rules = rules);
    this.layoutService.getLayouts()
        .pipe(map(data => data.map((layout: ILayout) => new Layout(layout))))
        .subscribe(layouts => this.layouts = layouts);
    this.solverService.getSolvers()
        .subscribe(solvers => this.solvers = solvers);
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
