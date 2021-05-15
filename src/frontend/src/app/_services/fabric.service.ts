import {Injectable, NgZone} from '@angular/core';

import {fabric} from 'fabric';
import {IEvent, Point} from 'fabric/fabric-impl';
import {Layout} from '../_dtos/layout';

export class POINT {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Seat {
  x: number;
  y: number;
  busy: boolean;

  constructor(x: number, y: number, busy: boolean) {
    this.x = x;
    this.y = y;
    this.busy = busy;
  }

  distance(seat: Seat): number {
    const tmpX = (this.x - seat.x);
    const tmpY = (this.y - seat.y);
    return Math.sqrt(tmpX * tmpX + tmpY * tmpY);
  }
}


@Injectable({
  providedIn: 'root'
})
export class FabricService {
  protected canvas?: fabric.Canvas;
  protected isStatic = false;
  protected width = 0;
  protected height = 0;
  protected cellSize = 10;
  protected seatSize = 40;
  private isDragging = false;
  private isHovering = false;
  private lastPosX = -1;
  private lastPosY = -1;
  private snapToGrid = true;
  private clipboard: any;

  constructor(protected ngZone: NgZone) {
    fabric.Group.prototype.lockScalingX = true;
    fabric.Group.prototype.lockScalingY = true;
    fabric.Group.prototype.transparentCorners = false;
    fabric.Group.prototype.borderColor = 'rgba(30, 136, 229, 0.9)';
    fabric.Group.prototype.cornerColor = 'rgba(30, 136, 229, 0.9)';
    fabric.Group.prototype.cornerSize = 7;
    fabric.Group.prototype.setControlsVisibility({
      mtr: false
    });
    fabric.Object.prototype.lockScalingX = true;
    fabric.Object.prototype.lockScalingY = true;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderColor = 'rgba(30, 136, 229, 0.9)';
    fabric.Object.prototype.cornerColor = 'rgba(30, 136, 229, 0.9)';
    fabric.Object.prototype.cornerSize = 7;
    fabric.Object.prototype.setControlsVisibility({
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: false
    });
    fabric.Canvas.prototype.notAllowedCursor = 'default';
  }

  public setCanvas(canvas: fabric.Canvas, isStatic: boolean): void {
    this.canvas = canvas;
    if (isStatic){
      this.canvas.off('mouse:down');
    }
    else{
      this.canvas.on('object:moving', event => {
        this.onObjectMove(event);
      });
    }
  }

  public set Width(width: number) {
    this.width = width;
  }

  public set Height(height: number) {
    this.height = height;
  }

  public set SnapToGrid(value: boolean) {
    this.snapToGrid = value;
  }

  public clear(drawCanvas: boolean): void {
    if (!this.canvas) {
      return;
    }
    this.canvas.getObjects().filter(obj => obj.type === 'rect').forEach(obj => {
      if (!this.canvas) {
        return;
      }
      this.canvas.remove(obj);
    });
    const vpt = this.canvas.viewportTransform;
    if (vpt) {
      vpt[4] = 0;
      vpt[5] = 0;
    }
    this.canvas.setZoom(1);
    if (drawCanvas) {
      this.canvas.renderAll();
    }
  }

  getSeatData(): string {
    let minX = this.width * 2;
    let minY = this.height * 2;
    const seats: Seat[] = [];
    const objects = this.canvas?.getObjects().filter(obj => obj.type === 'rect');
    objects?.forEach(obj => {
      if (obj.left && obj.top) {
        if (obj.left < minX) {
          minX = obj.left;
        }
        if (obj.top < minY) {
          minY = obj.top;
        }
      }
    });

    objects?.forEach(obj => {
      if (obj.left && obj.top) {
        seats.push(new Seat(obj.left - minX, obj.top - minY, false));
      }
    });
    return JSON.stringify(seats);
  }

  // Csak ez a függvény kell a kirajzoláshoz
  // megoldásnál is ez kell, ha busy a szék azt zöldre rakja
  loadLayout(layout: Layout): void {
    if (!this.canvas) {
      return;
    }
    this.clear(false);
    console.log(layout.coords);

    const seats: Seat[] = JSON.parse(layout.coords);
    const rectGroup: fabric.Object[] = [];
    console.log(seats);

    seats.forEach(seat => {
      const rect = new fabric.Rect({
        width: this.seatSize,
        height: this.seatSize,
        fill: '#dcdde1',
        stroke: '#ff3838',
        strokeWidth: 1,
        opacity: 1,
        top: seat.y + 10,
        left: seat.x + 10,
        selectable: false,
        evented: false
      });
      if (seat.busy){
        rect.fill = '#0be881';
        rect.stroke = '#05c46b';
      }
      rectGroup.push(rect);
      this.canvas?.add(rect);
    });

    const selection = new fabric.ActiveSelection(rectGroup);
    const boundingHeight = selection.getBoundingRect().height;
    const boundingWidth = selection.getBoundingRect().width;
    selection.destroy();
    this.canvas.discardActiveObject();

    const ratio = Math.min(this.height / (boundingHeight + 20), this.width / (boundingWidth + 20));

    this.canvas.setZoom(ratio);
    this.canvas.requestRenderAll();
  }

  saveLayout(layoutName: string): Layout {
    // Ez tárolja a canvas-ról készített képet
    const img = new Image();
    if (this.canvas){
      img.src = this.canvas.toDataURL();
    }
    console.log(this.getSeatData());
    return new Layout({id: 0, name: layoutName, coords: this.getSeatData(), created: ''});
  }

  addSeat(): void {
    if (!this.canvas) {
      return;
    }
    const seat = new fabric.Rect({
      width: this.seatSize,
      height: this.seatSize,
      fill: '#ffda79',
      hasBorders: true,
      stroke: '#ccae62',
      strokeWidth: 1,
      opacity: 1,
      lockScalingX: true,
      lockScalingY: true,
      top: 10,
      left: 10
    });
    this.canvas.add(seat);
    this.canvas.setActiveObject(seat);
    this.canvas.renderAll();
  }

  Delete(): void {
    if (!this.canvas) {
      return;
    }
    if (!this.canvas.getActiveObjects()) {
      return;
    }
    this.canvas.getActiveObjects().forEach(obj => {
      this.canvas?.remove(obj);
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  Copy(): void {
    if (!this.canvas) {
      return;
    }
    this.canvas.getActiveObject().clone((cloned: any) => {
      this.clipboard = cloned;
    });
  }

  Paste(): void {
    this.clipboard.clone((clonedObj: any) => {
      if (!this.canvas) {
        return;
      }
      this.canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 50,
        top: clonedObj.top + 50,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = this.canvas;
        clonedObj.forEachObject((obj: any) => {
          if (!this.canvas) {
            return;
          }
          this.canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        this.canvas.add(clonedObj);
      }
      this.clipboard.top += 50;
      this.clipboard.left += 50;
      this.canvas.setActiveObject(clonedObj);
      this.canvas.requestRenderAll();
    });
  }

  generateSeats(rows: number, cols: number, distanceX: number, distanceY: number, seatSize: number): boolean {
    if ((rows - 1) * (distanceY + this.seatSize) + this.seatSize > this.height * 2 - 20 ||
      (cols - 1) * (distanceX + this.seatSize) + this.seatSize > this.width * 2 - 20) {
      return false;
    }
    if (!this.canvas) {
      return false;
    }
    const rectGroup: fabric.Object[] = [];
    this.clear(false);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seat = new fabric.Rect({
          width: seatSize,
          height: seatSize,
          fill: '#ffda79',
          hasBorders: true,
          stroke: '#ccae62',
          strokeWidth: 1,
          opacity: 1,
          lockScalingX: true,
          lockScalingY: true,
          top: this.cellSize + row * (distanceY + seatSize),
          left: this.cellSize + col * (distanceX + seatSize)
        });
        rectGroup.push(seat);
        this.canvas.add(seat);
      }
    }

    const selection = new fabric.ActiveSelection(rectGroup);
    const boundingHeight = selection.getBoundingRect().height;
    const boundingWidth = selection.getBoundingRect().width;
    selection.destroy();
    this.canvas.discardActiveObject();

    const ratio = Math.min(this.height / (boundingHeight + 20), this.width / (boundingWidth + 20));

    this.canvas.setZoom(ratio);
    this.canvas.requestRenderAll();
    return true;
  }

  drawGrid(): void {
    if (!this.canvas) {
      return;
    }

    const gridWidth = this.width * 2;
    const gridHeight = this.width * 2;

    const gridLen = gridWidth / this.cellSize;
    for (let i = 0; i < gridLen; i++) {
      const distance = i * this.cellSize;
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
    this.canvas.renderAll();
  }

  onScroll(event: WheelEvent): void {
    if (!this.canvas) {
      return;
    }

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

    this.canvas.forEachObject(object => {
      object.setCoords();
    });
    this.canvas.requestRenderAll();
  }

  onMouseOver(event: MouseEvent): void {
    this.isHovering = true;
  }

  onMouseLeave(event: MouseEvent): void {
    this.isHovering = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.canvas) {
      return;
    }
    if (event.key === 'Alt') {
      event.preventDefault();
      if (this.isHovering) {
        this.canvas.setCursor('pointer');
        this.canvas.defaultCursor = 'pointer';
        this.canvas.hoverCursor = 'pointer';
      }
    }
    if (event.key === 'Delete' || event.key === ',') {
      this.Delete();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
      if (!this.canvas) {
        return;
      }
      if (this.isDragging) {
        if (!this.canvas) {
          return;
        }
        this.isDragging = false;
        this.canvas.forEachObject(object => {
          object.setCoords();
        });
        setTimeout(this.enableCanvasSelection, 0, this.canvas);
      }
      this.canvas.setCursor('default');
      this.canvas.defaultCursor = 'default';
      this.canvas.hoverCursor = 'move';
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.altKey) {
      if (!this.canvas) {
        return;
      }
      this.canvas.discardActiveObject();
      this.isDragging = true;
      this.canvas.selection = false;
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      if (!this.canvas) {
        return;
      }
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

  onMouseUp(event: MouseEvent): void {
    if (this.isDragging) {
      if (!this.canvas) {
        return;
      }
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

  onObjectMove(event: IEvent): void {
    if (!this.snapToGrid) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      const object = event.target;
      if (!object || !object.top || !object.left) {
        return;
      }
      if (object.top % this.cellSize !== 0 || object.left % this.cellSize !== 0) {
        object.top = Math.round(object.top / this.cellSize) * this.cellSize;
        object.left = Math.round(object.left / this.cellSize) * this.cellSize;
      }
      object.setCoords();
    });
  }
}
