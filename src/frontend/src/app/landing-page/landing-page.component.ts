import { Component, OnInit } from '@angular/core';
declare function initialiseAnimation(): any;
declare function draw(): any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  static intervalId: number;

  constructor() { }

  ngOnInit(): void {
    initialiseAnimation();
    this.startInterval();
  }

  startInterval(): void {
    if (LandingPageComponent.intervalId) { // always undefined
      window.clearInterval(LandingPageComponent.intervalId);
    }
    LandingPageComponent.intervalId = window.setInterval(() => { draw(); }, 75);
  }

}
