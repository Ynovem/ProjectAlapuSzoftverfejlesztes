import {Component, OnInit, AfterViewInit, HostListener, Directive} from '@angular/core';
import { fabric } from 'fabric';
import {Point} from 'fabric/fabric-impl';

@Component({
  selector: 'app-fabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss']
})

export class FabricComponent implements OnInit, AfterViewInit {
  canvasId = 'designer-canvas';
  canvas: fabric.Canvas;
  width: number;
  height: number;
  private isDragging = false;
  private isHovering = false;
  private lastPosX = -1;
  private lastPosY = -1;

  constructor() {
    this.canvas = new fabric.Canvas('');
    this.width = 1500;
    this.height = 857;
  }

  public ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas(this.canvasId, {
      imageSmoothingEnabled: false,
      backgroundColor: '#fff',
      renderOnAddRemove: false
    });
    this.canvas.add(new fabric.Textbox('Hello Fabric!'));
    this.drawGrid(10, this.width * 2, this.height * 2, 0, 0);
  }

  drawGrid(cellSize: number, gridWidth: number, gridHeight: number, xPos: number, yPos: number): void {
    if (!this.canvas) {
      return;
    }

    const gridLen = gridWidth / cellSize;
    for (let i = 0; i < gridLen; i++) {
      const distance = i * cellSize;
      const vertical = new fabric.Line([distance, 0, distance, gridHeight], {
        stroke: '#ebebeb',
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
      const horizontal = new fabric.Line([0, distance, gridWidth, distance], {
        stroke: '#ebebeb',
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
      if (distance <= gridHeight) {
        this.canvas.add(horizontal);
      }
      this.canvas.add(vertical);
      if (i % 5 === 0) {
        horizontal.set({stroke: '#cccccc'});
        vertical.set({stroke: '#cccccc'});
        if (distance <= gridHeight) {
          this.canvas.sendBackwards(horizontal);
        }
        this.canvas.sendBackwards(vertical);
      } else {
        if (distance <= gridHeight) {
          this.canvas.sendToBack(horizontal);
        }
        this.canvas.sendToBack(vertical);
      }
    }


    /*for (let i = 1; i < gridWidth; i += cellSize) {
      const line = new fabric.Line([0, 0, 0, gridHeight], {
        left: i,
        top: 1,
        stroke: '#000000',
        strokeWidth: 1,
        selectable: false
      });
      gridGroup.add(line);
    }*/

    /*for (let i = 1; i < (gridHeight / cellSize); i++ {; } ) {
      const line = new fabric.Line([0, 0, gridWidth, 0], {
        left: Math.round(-gridWidth / 2),
        top: Math.round((gridHeight / 2)) - i * cellSize,
        stroke: '#000000',
        strokeWidth: 1,
        selectable: false
      });
      gridGroup.add(line);
    }

    for (let i = 0; i < (gridWidth / cellSize); i++) {
      const text = new fabric.Text(String((i) * 5), {
        left: -(gridWidth / 2) + i * cellSize,
        top: -(gridHeight / 2) - 20,
        fontSize: 14,
        selectable: false
      });
      gridGroup.add(text);
    }

    for (let i = 0; i < (gridHeight / cellSize); i++) {
      const text = new fabric.Text(String((i) * 5), {
        left: -(gridWidth / 2) - 20,
        top: -(gridHeight / 2) + (i) * cellSize,
        fontSize: 14,
        textAlign: 'right',
        selectable: false
      });
      gridGroup.add(text);
    }*/

    this.canvas.renderAll();
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    const delta = event.deltaY;
    let zoom = this.canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 8) {
      zoom = 8;
    }
    if (zoom < 0.5) {
      zoom = 0.5;
    }

    this.canvas.zoomToPoint({x: event.offsetX, y: event.offsetY} as Point, zoom);

    if (event.deltaY > 0) {
      const vpt = this.canvas.viewportTransform;
      if (vpt) {
        if (vpt[4] > 0) {
          vpt[4] = 0;
        }
        if (vpt[4] < -2 * this.width * zoom + this.width) {
          vpt[4] = Math.floor(-2 * this.width * zoom + this.width);
        }
        if (vpt[5] > 0) {
          vpt[5] = 0;
        }
        if (vpt[5] < -2 * this.height * zoom + this.height) {
          vpt[5] = Math.floor(-2 * this.height * zoom + this.height);
        }
      }
    }

    this.canvas.requestRenderAll();
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void{
    this.isHovering = true;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void{
    this.isHovering = false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void{
    if (event.key === 'Alt'){
      event.preventDefault();
      if (this.isHovering){
        this.canvas.setCursor('pointer');
        this.canvas.defaultCursor = 'pointer';
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void{
    if (event.key === 'Alt') {
      this.canvas.setCursor('default');
      this.canvas.defaultCursor = 'default';
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.altKey) {
      this.canvas.discardActiveObject();
      this.isDragging = true;
      this.canvas.selection = false;
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const zoom = this.canvas.getZoom();
      const distanceX = event.clientX - this.lastPosX;
      const distanceY = event.clientY - this.lastPosY;
      const vpt = this.canvas.viewportTransform;
      if (vpt) {
        vpt[4] += distanceX;
        if (vpt[4] > 0) {
          vpt[4] = 0;
        }
        if (vpt[4] < -2 * this.width * zoom + this.width) {
          vpt[4] = Math.floor(-2 * this.width * zoom + this.width);
        }
        if (vpt[4] <= 0 && vpt[4] >= -2 * this.width * zoom + this.width) {
          this.lastPosX = event.clientX;
        }

        vpt[5] += distanceY;
        if (vpt[5] > 0) {
          vpt[5] = 0;
        }
        if (vpt[5] < -2 * this.height * zoom + this.height) {
          vpt[5] = Math.floor(-2 * this.height * zoom + this.height);
        }
        if (vpt[5] <= 0 && vpt[5] >= -2 * this.height * zoom + this.height) {
          this.lastPosY = event.clientY;
        }
      }
      this.canvas.requestRenderAll();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isDragging){
      this.isDragging = false;
      this.canvas.forEachObject(object => {
        object.setCoords();
      });
      setTimeout(this.enableCanvasSelection, 0, this.canvas);
    }
  }

  enableCanvasSelection(canvas: fabric.Canvas): void {
    canvas.selection = true;
  }
}
