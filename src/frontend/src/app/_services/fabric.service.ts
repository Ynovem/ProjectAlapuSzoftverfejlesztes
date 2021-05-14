import {Injectable, NgZone} from '@angular/core';

import { fabric } from 'fabric';
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

class Seat{
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}


@Injectable({
  providedIn: 'root'
})
export class FabricService {
  protected canvas?: fabric.Canvas;
  protected width = 0;
  protected height = 0;
  protected cellSize = 10;
  protected seatSize = 40;
  private isDragging = false;
  private isHovering = false;
  private lastPosX = -1;
  private lastPosY = -1;
  private snapToGrid = true;

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

  public set Canvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.canvas.on('object:moving', event => {
      this.onObjectMove(event);
    });
  }

  public get Canvas(): fabric.Canvas {
    if (this.canvas) { return this.canvas; }
    else { return new fabric.Canvas(''); }
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

  public clear(): void {
    if (!this.canvas) { return; }
    this.canvas.getObjects().filter(obj => obj.evented === true).forEach(obj => {
      if (!this.canvas) { return; }
      this.canvas.remove(obj);
    });
  }

  getSeatData(): string{
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
        seats.push(new Seat(obj.left - minX, obj.top - minY));
      }
    });
    console.log(seats);
    return JSON.stringify(seats);
  }

  countColumnsLeft(x: number, objects: fabric.Object[]): number{
    let count = 0;
    const uniqueNums: number[] = [];
    objects?.forEach(obj => {
      if (obj.left && obj.left < x && !uniqueNums.includes(obj.left)) {
        count++;
        uniqueNums.push(obj.left);
      }
    });
    return count;
  }

  countRowsAbove(y: number, objects: fabric.Object[]): number{
    let count = 0;
    const uniqueNums: number[] = [];
    objects?.forEach(obj => {
      if (obj.top && obj.top < y && !uniqueNums.includes(obj.top)) {
        count++;
        uniqueNums.push(obj.top);
      }
    });
    return count;
  }

  saveLayout(layoutName: string): Layout{
    const id = 0;
    const name = layoutName;
    const created = new Date().toString();
    const coords = this.getSeatData();

    return new Layout({id, name, coords, created});
  }

  generateSeats(rows: number, cols: number, distanceX: number, distanceY: number, seatSize: number): void{
    if (!this.canvas) { return; }
    this.clear();
    for (let row = 0; row < rows; row++){
      for (let col = 0; col < cols; col++){
        const seat = new fabric.Rect({
          width: seatSize,
          height: seatSize,
          fill: '#ffda79',
          hasBorders: true,
          stroke : '#ccae62',
          strokeWidth : 1,
          opacity: 1,
          lockScalingX: true,
          lockScalingY: true,
          top: this.cellSize + row * (distanceY + seatSize),
          left: this.cellSize + col * (distanceX + seatSize)
        });
        this.canvas.add(seat);
      }
    }
    this.canvas.renderAll();
  }

  drawGrid(): void {
    if (!this.canvas) { return; }
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
      if (!this.canvas) { return; }
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

  onMouseOver(event: MouseEvent): void{
    this.isHovering = true;
  }

  onMouseLeave(event: MouseEvent): void{
    this.isHovering = false;
  }

  onKeyDown(event: KeyboardEvent): void{
    if (!this.canvas) { return; }
    if (event.key === 'Alt'){
      event.preventDefault();
      if (this.isHovering){
        this.canvas.setCursor('pointer');
        this.canvas.defaultCursor = 'pointer';
        this.canvas.hoverCursor = 'pointer';
      }
    }
  }

  onKeyUp(event: KeyboardEvent): void{
    if (event.key === 'Alt') {
      if (!this.canvas) { return; }
      if (this.isDragging){
        if (!this.canvas) { return; }
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
      if (!this.canvas) { return; }
      this.canvas.discardActiveObject();
      this.isDragging = true;
      this.canvas.selection = false;
      this.lastPosX = event.clientX;
      this.lastPosY = event.clientY;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      if (!this.canvas) { return; }
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
    if (this.isDragging){
      if (!this.canvas) { return; }
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
    if (!this.snapToGrid) { return; }
    this.ngZone.runOutsideAngular( () => {
      const object = event.target;
      if (!object || !object.top || !object.left) { return; }
      if (object.top % this.cellSize !== 0 || object.left % this.cellSize !== 0){
        object.top = Math.round(object.top / this.cellSize) * this.cellSize;
        object.left = Math.round(object.left / this.cellSize) * this.cellSize;
      }
      object.setCoords();
    });
  }
}
