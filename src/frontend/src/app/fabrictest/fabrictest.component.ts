import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-fabrictest',
  templateUrl: './fabrictest.component.html',
  styleUrls: ['./fabrictest.component.scss']
})
export class FabrictestComponent implements OnInit, AfterViewInit {
  canvasId: string = "designer-canvas";

  constructor() {
  }

  public ngOnInit(): void
  {
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasId);
    this.canvas.add(new fabric.Textbox('Hello Fabric!'));
    this.drawGrid(10, 1000, 700, 0, 0);
  }

  drawGrid(cellSize: number, gridWidth: number, gridHeight: number, xPos: number, yPos: number) {
    if (!this.canvas) {
      return
    }

    let bkgndrect = new fabric.Rect({
      width: gridWidth + 50,
      height: gridHeight + 50,
      stroke: '#ccc',
      fill: 'transparent',
      selectable: false
    });

    let rect = new fabric.Rect({
      left: 25,
      top: 25,
      width: gridWidth,
      height: gridHeight,
      stroke: '#000000',
      fill: '#cccccc',
      selectable: false
    });

    let gridGroup = new fabric.Group([bkgndrect, rect], {
      left: xPos,
      top: yPos,
      selectable: false
    });

    this.canvas.add(gridGroup);

    for (let i = 1; i < (gridWidth / cellSize); i++) {
      let line = new fabric.Line([0, 0, 0, gridHeight], {
        left: (gridWidth / 2) - i * cellSize,
        top: -gridHeight / 2,
        stroke: '#000000',
        selectable: false
      });
      gridGroup.add(line);
    }

    for (let i = 1; i < (gridHeight / cellSize); i++) {
      let line = new fabric.Line([0, 0, gridWidth, 0], {
        left: -gridWidth / 2,
        top: (gridHeight / 2) - i * cellSize,
        stroke: '#000000',
        selectable: false
      });
      gridGroup.add(line);
    }

    for (let i = 0; i < (gridWidth / cellSize); i++) {
      let text = new fabric.Text(String((i) * 5), {
        left: -(gridWidth / 2) + i * cellSize,
        top: -(gridHeight / 2) - 20,
        fontSize: 14,
        selectable: false
      });
      gridGroup.add(text);
    }

    for (let i = 0; i < (gridHeight / cellSize); i++) {
      let text = new fabric.Text(String((i) * 5), {
        left: -(gridWidth / 2) - 20,
        top: -(gridHeight / 2) + (i) * cellSize,
        fontSize: 14,
        textAlign: 'right',
        selectable: false
      });
      gridGroup.add(text);
    }

    this.canvas.renderAll();
  }
}
