import { Component, OnInit } from '@angular/core';
import { map } from "rxjs/operators";

import { ILayout, Layout } from "../_dtos/layout"
import { Solver } from "../_dtos/solver"

import { LayoutService } from "../_services/layout.service";
import { SolverService } from "../_services/solver.service";

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit {
  layouts: ILayout[] = [];
  solvers: Solver[] = [];

  selectedSolver: Solver | null = null;
  selectedLayout: ILayout | null = null;

  constructor(
      private layoutService: LayoutService,
      private solverService: SolverService,
  ) {
    this.layoutService.getLayouts()
        .pipe(map(data => data.map((layout: ILayout) => new Layout(layout))))
        .subscribe(layouts => this.layouts = layouts)
    this.solverService.getSolvers()
        .subscribe(solvers => this.solvers = solvers)
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

  solve() {
    console.log("Solve-placeholder");
  }
}
